import { supabase } from './_utils/clients.js';
import { hashPassword, signToken, verifyToken, getAuthUser, auditLog } from './_utils/auth.js';
import { sendPasswordResetEmail } from './_utils/emails.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query || {};

  if (!supabase) {
    return res.status(500).json({ error: 'Database client not initialized.' });
  }

  try {
    // 1. Action: Login (Public)
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error) throw error;
      if (!user) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Usuario no encontrado.' });
      }

      const incomingHash = hashPassword(password);
      if (user.password_hash !== incomingHash) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Contraseña incorrecta.' });
      }

      // Generate session JWT Token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      const token = signToken(tokenPayload);

      // Write to audit log
      await auditLog(user.id, user.email, user.role, 'login', 'Inicio de sesión administrativo exitoso');

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    }

    // 2. Action: Verify token (Public)
    if (req.method === 'POST' && action === 'verify') {
      const { token } = req.body || {};
      if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
      }
      
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, error: 'INVALID_TOKEN', message: 'Sesión inválida o expirada.' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        }
      });
    }

    // 3. Action: Forgot password (Public)
    if (req.method === 'POST' && action === 'forgot_password') {
      const { email } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      // Check if user exists
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error) throw error;
      if (!user) {
        // Return 200 for security to avoid email enumeration
        return res.status(200).json({
          success: true,
          message: 'Si el correo está registrado, recibirás una nueva contraseña temporal.'
        });
      }

      // Generate a temporary random password
      const tempPass = 'CL-' + Math.floor(100000 + Math.random() * 900000);
      const pHash = hashPassword(tempPass);

      // Update in DB
      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({ password_hash: pHash })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      // Log action
      await auditLog(user.id, user.email, user.role, 'reset_password_request', 'Solicitud de restablecimiento de contraseña (temporal enviada)');

      // Send email
      const emailRes = await sendPasswordResetEmail(user.email, tempPass);
      if (!emailRes.success) {
        return res.status(500).json({ error: 'EMAIL_SEND_FAILED', message: 'No se pudo enviar el correo de restablecimiento.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Se ha enviado una nueva contraseña temporal a tu correo electrónico.'
      });
    }

    // 4. Action: List audit logs (Restricted to admin & visor)
    if (req.method === 'GET' && action === 'audit_logs') {
      const currentUser = getAuthUser(req);
      if (!currentUser) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Inicia sesión para continuar.' });
      }

      if (currentUser.role !== 'admin' && currentUser.role !== 'visor') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'Acceso restringido.' });
      }

      const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return res.status(200).json({ success: true, logs });
    }

    // --- SECURE ACTIONS (Require authentication) ---
    const currentUser = getAuthUser(req);
    if (!currentUser) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Acceso denegado. Token inválido o expirado.' });
    }

    // List staff users (Admin only)
    if (req.method === 'GET' && action === 'list_users') {
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes privilegios de Administrador.' });
      }

      const { data: users, error } = await supabase
        .from('admin_users')
        .select('id, email, name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, users });
    }

    // Create staff user (Admin only)
    if (req.method === 'POST' && action === 'create_user') {
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes privilegios de Administrador.' });
      }

      const { email, password, name, role } = req.body || {};
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
      }

      const pHash = hashPassword(password);
      const { data: newUser, error } = await supabase
        .from('admin_users')
        .insert({
          email: email.trim().toLowerCase(),
          password_hash: pHash,
          name: name.trim(),
          role
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'EMAIL_ALREADY_EXISTS', message: 'Este correo electrónico ya está registrado.' });
        }
        throw error;
      }

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'create_user',
        `Creación de usuario: ${email} con rol: ${role}`
      );

      return res.status(200).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      });
    }

    // Update staff user (Admin only)
    if (req.method === 'POST' && action === 'update_user') {
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes privilegios de Administrador.' });
      }

      const { id, email, password, name, role } = req.body || {};
      if (!id || !email || !name || !role) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
      }

      const updateData = {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role
      };

      if (password && password.trim() !== '') {
        updateData.password_hash = hashPassword(password);
      }

      const { error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'update_user',
        `Modificación de usuario: ${email} (Nuevo Rol: ${role})`
      );

      return res.status(200).json({ success: true });
    }

    // Delete staff user (Admin only)
    if (req.method === 'POST' && action === 'delete_user') {
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'No tienes privilegios de Administrador.' });
      }

      const { id, email } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'ID del usuario es obligatorio.' });
      }

      // Prevent deleting self
      if (id === currentUser.userId) {
        return res.status(400).json({ error: 'SELF_DELETION', message: 'No puedes auto-eliminarte de la plataforma.' });
      }

      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'delete_user',
        `Eliminación de usuario: ${email || id}`
      );

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Acción inválida.' });

  } catch (err) {
    console.error("Auth handler exception:", err);
    return res.status(500).json({ error: err.message || 'Database error.' });
  }
}
