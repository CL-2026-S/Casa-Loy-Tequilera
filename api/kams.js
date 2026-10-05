import { supabase } from './_utils/clients.js';
import { getAuthUser, auditLog, userHasRole } from './_utils/auth.js';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- 1. GET: List all registered KAMs with store counts ---
  if (req.method === 'GET') {
    if (!supabase) {
      return res.status(500).json({ error: 'Database client not initialized.' });
    }

    try {
      // Fetch all KAMs
      const { data: kams, error: kamError } = await supabase
        .from('sales_kams')
        .select('*')
        .order('name', { ascending: true });

      if (kamError) throw kamError;

      // Count points of sale for each KAM
      const { data: storeCounts, error: storeError } = await supabase
        .from('points_of_sale')
        .select('fase');

      const countMap = {};
      if (!storeError && storeCounts) {
        storeCounts.forEach(s => {
          const sellerName = (s.fase && s.fase.trim()) ? s.fase.trim() : 'Sin Asignar';
          countMap[sellerName] = (countMap[sellerName] || 0) + 1;
        });
      }

      // Merge store counts into KAM objects
      const enhancedKams = (kams || []).map(k => ({
        ...k,
        stores_count: countMap[k.name.trim()] || 0
      }));

      return res.status(200).json({
        kams: enhancedKams,
        all_store_counts: countMap
      });
    } catch (err) {
      console.error('Error fetching KAMs:', err);
      return res.status(500).json({ error: 'Error al obtener la lista de vendedores / KAMs.' });
    }
  }

  // Auth check for mutation operations
  const currentUser = getAuthUser(req);
  if (!currentUser || !userHasRole(currentUser, 'admin', 'editor')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No tienes permisos para modificar Vendedores / KAMs.' });
  }

  // --- 2. POST: Register a new KAM ---
  if (req.method === 'POST') {
    const { name, email, phone, notes, is_active } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del vendedor / KAM es obligatorio.' });
    }

    const trimmedName = name.trim();

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('sales_kams')
        .select('id')
        .ilike('name', trimmedName)
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ error: `Ya existe un Vendedor / KAM registrado con el nombre "${trimmedName}".` });
      }

      const { data: newKam, error: insertError } = await supabase
        .from('sales_kams')
        .insert({
          name: trimmedName,
          email: email ? email.trim() : null,
          phone: phone ? phone.trim() : null,
          notes: notes ? notes.trim() : null,
          is_active: is_active === undefined ? true : Boolean(is_active)
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'create_kam',
        `Registrado nuevo Vendedor / KAM: ${trimmedName}`
      );

      return res.status(201).json({ success: true, kam: newKam });
    } catch (err) {
      console.error('Error registering KAM:', err);
      return res.status(500).json({ error: err.message || 'Error al registrar el vendedor / KAM.' });
    }
  }

  // --- 3. PUT: Edit or Rename a KAM, or Reassign stores ---
  if (req.method === 'PUT') {
    const { action, id, name, old_name, email, phone, notes, is_active, source_name, target_name } = req.body || {};

    try {
      // Sub-action: Reassign all points of sale from one KAM to another
      if (action === 'reassign_stores') {
        if (!source_name || !target_name) {
          return res.status(400).json({ error: 'Debe especificar el vendedor origen y el vendedor destino.' });
        }

        const { data: updatedStores, error: reassignError } = await supabase
          .from('points_of_sale')
          .update({ fase: target_name.trim() })
          .eq('fase', source_name.trim())
          .select('id');

        if (reassignError) throw reassignError;

        const updatedCount = updatedStores ? updatedStores.length : 0;

        await auditLog(
          currentUser.userId,
          currentUser.email,
          currentUser.role,
          'reassign_kam_stores',
          `Reasignados ${updatedCount} puntos de venta de "${source_name}" a "${target_name}"`
        );

        return res.status(200).json({
          success: true,
          message: `Se reasignaron ${updatedCount} puntos de venta a ${target_name}.`,
          updated_count: updatedCount
        });
      }

      // Default PUT: Edit / Rename KAM
      if (!id || !name || !name.trim()) {
        return res.status(400).json({ error: 'ID y Nombre son obligatorios para actualizar.' });
      }

      const trimmedName = name.trim();
      const previousName = old_name ? old_name.trim() : null;

      // Update the KAM in sales_kams
      const { data: updatedKam, error: updateError } = await supabase
        .from('sales_kams')
        .update({
          name: trimmedName,
          email: email !== undefined ? (email ? email.trim() : null) : undefined,
          phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
          notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Automatic Cascade: If the name was changed, update all points_of_sale assigned to the old name!
      let affectedPosCount = 0;
      if (previousName && previousName !== trimmedName) {
        const { data: updatedPos, error: posSyncError } = await supabase
          .from('points_of_sale')
          .update({ fase: trimmedName })
          .eq('fase', previousName)
          .select('id');

        if (posSyncError) {
          console.warn('Could not cascade update points_of_sale:', posSyncError);
        } else {
          affectedPosCount = updatedPos ? updatedPos.length : 0;
        }
      }

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'update_kam',
        previousName && previousName !== trimmedName
          ? `Renombrado Vendedor / KAM de "${previousName}" a "${trimmedName}" (${affectedPosCount} puntos de venta sincronizados).`
          : `Actualizados datos del Vendedor / KAM: ${trimmedName}`
      );

      return res.status(200).json({
        success: true,
        kam: updatedKam,
        affected_pos_count: affectedPosCount,
        message: previousName && previousName !== trimmedName
          ? `Vendedor renombrado exitosamente. Se actualizaron ${affectedPosCount} puntos de venta asociados.`
          : 'Vendedor actualizado con éxito.'
      });
    } catch (err) {
      console.error('Error updating KAM:', err);
      return res.status(500).json({ error: err.message || 'Error al actualizar el vendedor / KAM.' });
    }
  }

  // --- 4. DELETE: Remove a KAM ---
  if (req.method === 'DELETE') {
    // Only Admin can delete a KAM
    if (!userHasRole(currentUser, 'admin')) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Solo los Administradores pueden eliminar un Vendedor / KAM.' });
    }

    const { id, name, reassign_to } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'El ID es obligatorio para eliminar.' });
    }

    try {
      // If reassign_to is provided, reassign POS before deleting
      if (name && reassign_to) {
        await supabase
          .from('points_of_sale')
          .update({ fase: reassign_to.trim() })
          .eq('fase', name.trim());
      }

      const { error: deleteError } = await supabase
        .from('sales_kams')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await auditLog(
        currentUser.userId,
        currentUser.email,
        currentUser.role,
        'delete_kam',
        `Eliminado Vendedor / KAM "${name || id}"${reassign_to ? `. Puntos de venta reasignados a "${reassign_to}".` : ''}`
      );

      return res.status(200).json({ success: true, message: 'Vendedor / KAM eliminado con éxito.' });
    } catch (err) {
      console.error('Error deleting KAM:', err);
      return res.status(500).json({ error: err.message || 'Error al eliminar el vendedor / KAM.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
