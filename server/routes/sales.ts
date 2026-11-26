import { Router, Response } from 'express';

import {
  SalesRequest,
  salesDb,
  requireIdentity,
  requireSalesUser,
  requireSalesAdmin,
} from '../middleware/salesAuth';

const router = Router();

const profileFields =
  'id,email,first_name,last_name,role,is_active';

const userFields =
  `${profileFields},created_at,updated_at`;

const companyEmail =
  /^[^@\s]+@btrpolymers\.com$/i;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validRole(role: unknown) {
  return role === 'employee' || role === 'admin';
}

function validName(name: unknown): name is string {
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    name.trim().length <= 100
  );
}

function serverError(res: Response, error?: unknown) {
  console.error('Sales API error:', error);

  return res.status(500).json({
    message: error instanceof Error
      ? error.message
      : JSON.stringify(error) || 'Unknown server error.',
  });
}

// Resolve or activate the current user's profile.

router.get(
  '/me',
  requireIdentity,
  async (req: SalesRequest, res) => {
    try {
      const user = req.authUser!;

      const { data: existing, error } =
        await salesDb
          .from('sales_users')
          .select(profileFields)
          .eq('id', user.id)
          .maybeSingle();

      if (error) {
        console.error('Sales profile lookup failed:', error);
        return serverError(res, error);
      }

      if (existing) {
        if (!existing.is_active) {
          return res.status(403).json({
            message: 'Your sales account is inactive.',
          });
        }

        return res.json(existing);
      }

      const email = user.email?.toLowerCase();

      const verifiedGoogleIdentity =
        user.identities?.some(identity =>
          identity.provider === 'google' &&
          identity.identity_data?.email_verified === true &&
          identity.identity_data?.email
            ?.toLowerCase() === email
        );

      if (
        !email ||
        !companyEmail.test(email) ||
        !user.email_confirmed_at ||
        !verifiedGoogleIdentity
      ) {
        return res.status(403).json({
          message:
            'Your account is not authorized to access the BTR Sales Platform.',
        });
      }

      const { data, error: activationError } =
        await salesDb.rpc('activate_sales_user', {
          p_user_id: user.id,
          p_email: email,
        });

      if (activationError) {
        console.error(activationError);
        return serverError(res);
      }

      const profile = data?.[0];

      if (!profile || !profile.is_active) {
        return res.status(403).json({
          message:
            'Your account is not authorized to access the BTR Sales Platform.',
        });
      }

      const {
        id,
        first_name,
        last_name,
        role,
        is_active,
      } = profile;

      return res.json({
        id,
        email: profile.email,
        first_name,
        last_name,
        role,
        is_active,
      });
    } catch (error) {
        console.error('Sales /me endpoint failed:', error);
        return serverError(res, error);
    }
  }
);

// Everything below requires an active administrator.

router.use(
  '/admin',
  requireIdentity,
  requireSalesUser,
  requireSalesAdmin
);

// List registered and pending users.

router.get('/admin/users', async (_req, res) => {
  try {
    const [users, invitations] = await Promise.all([
      salesDb
        .from('sales_users')
        .select(userFields)
        .order('created_at', { ascending: false }),

      salesDb
        .from('sales_user_invitations')
        .select(userFields)
        .order('created_at', { ascending: false }),
    ]);

    if (users.error || invitations.error) {
      return serverError(res);
    }

    return res.json([
      ...(users.data || []).map(user => ({
        ...user,
        type: 'user',
      })),

      ...(invitations.data || []).map(user => ({
        ...user,
        type: 'invitation',
      })),
    ]);
  } catch {
    return serverError(res);
  }
});

// Preauthorize a new employee.

router.post(
  '/admin/users',
  async (req: SalesRequest, res) => {
    try {
      const {
        email,
        first_name,
        last_name,
        role,
      } = req.body || {};

      if (
        typeof email !== 'string' ||
        !companyEmail.test(email.trim()) ||
        !validName(first_name) ||
        !validName(last_name) ||
        !validRole(role)
      ) {
        return res.status(400).json({
          message:
            'Valid name, company email and role are required.',
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const { data: existing, error: readError } =
        await salesDb
          .from('sales_users')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

      if (readError) return serverError(res);

      if (existing) {
        return res.status(409).json({
          message: 'This user already exists.',
        });
      }

      const { data, error } = await salesDb
        .from('sales_user_invitations')
        .insert({
          email: normalizedEmail,
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          role,
          is_active: true,
          created_by: req.salesUser!.id,
        })
        .select(userFields)
        .single();

      if (error) {
        return res
          .status(error.code === '23505' ? 409 : 500)
          .json({
            message:
              error.code === '23505'
                ? 'This employee is already invited.'
                : 'Unable to add employee.',
          });
      }

      return res.status(201).json({
        ...data,
        type: 'invitation',
      });
    } catch {
      return serverError(res);
    }
  }
);

// Edit an employee or pending invitation.

router.patch(
  '/admin/users/:type/:id',
  async (req: SalesRequest, res) => {
    try {
      const { type, id } = req.params;

      if (
        !['user', 'invitation'].includes(type) ||
        !uuidPattern.test(id)
      ) {
        return res.status(400).json({
          message: 'Invalid user.',
        });
      }

      const {
        first_name,
        last_name,
        role,
        is_active,
      } = req.body || {};

      if (
        !validName(first_name) ||
        !validName(last_name) ||
        !validRole(role) ||
        typeof is_active !== 'boolean'
      ) {
        return res.status(400).json({
          message: 'Invalid user information.',
        });
      }

      if (
        type === 'user' &&
        id === req.salesUser!.id &&
        (!is_active || role !== 'admin')
      ) {
        return res.status(400).json({
          message:
            'You cannot deactivate or demote your own account.',
        });
      }

      const table =
        type === 'user'
          ? 'sales_users'
          : 'sales_user_invitations';

      const { data, error } = await salesDb
        .from(table)
        .update({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          role,
          is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(userFields)
        .maybeSingle();

      if (error) return serverError(res);

      if (!data) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }

      return res.json({
        ...data,
        type,
      });
    } catch {
      return serverError(res);
    }
  }
);

// Remove a pending invitation.
// Registered users are deactivated instead of deleted.

router.delete(
  '/admin/users/:type/:id',
  async (req: SalesRequest, res) => {
    try {
      const { type, id } = req.params;

      if (
        !['user', 'invitation'].includes(type) ||
        !uuidPattern.test(id)
      ) {
        return res.status(400).json({
          message: 'Invalid user.',
        });
      }

      if (
        type === 'user' &&
        id === req.salesUser!.id
      ) {
        return res.status(400).json({
          message:
            'You cannot remove your own account.',
        });
      }

      if (type === 'invitation') {
        const { error } = await salesDb
          .from('sales_user_invitations')
          .delete()
          .eq('id', id);

        if (error) return serverError(res);
      } else {
        const { error } = await salesDb
          .from('sales_users')
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) return serverError(res);
      }

      return res.status(204).end();
    } catch {
      return serverError(res);
    }
  }
);

export default router;