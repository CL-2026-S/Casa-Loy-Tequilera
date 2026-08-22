import crypto from 'crypto';
import { supabase } from './clients.js';

const SECRET = process.env.API_SECRET_KEY || 'dev_secret_key';

// Secure password hashing
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Sign custom JWT session token
export function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  // Token expires in 24 hours
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Verify custom JWT session token
export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  
  if (signature !== expectedSig) return null;
  
  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (Date.now() > decoded.exp) return null; // Token expired
    return decoded;
  } catch (e) {
    return null;
  }
}

// Writes an entry to the audit logs in Supabase
export async function auditLog(userId, email, role, action, details) {
  if (!supabase) {
    console.warn("Audit log writing skipped: Supabase client not initialized.");
    return;
  }
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId || null,
      user_email: email || 'desconocido@casaloy.com',
      user_role: role || 'visor',
      action: action,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details)
    });
    if (error) {
      console.error("Failed to write to audit_logs table:", error);
    }
  } catch (err) {
    console.error("Exception writing audit log:", err);
  }
}

// Helper to extract and verify JWT user from request headers
export function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

// Helper to check if a user has a specific role or multiple roles (comma separated)
export function userHasRole(user, ...roles) {
  if (!user || !user.role) return false;
  const userRoles = String(user.role).split(',').map(r => r.trim());
  if (userRoles.includes('admin')) return true;
  return roles.some(role => userRoles.includes(role));
}
