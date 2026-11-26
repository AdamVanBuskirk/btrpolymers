import {
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  createClient,
  User,
} from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY!;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const salesAuth = createClient(
  url,
  publishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const salesDb = createClient(
  url,
  serviceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export interface SalesRequest extends Request {
  authUser?: User;
  salesUser?: {
    id: string;
    email: string;
    role: 'admin' | 'employee';
    is_active: boolean;
  };
}

export async function requireIdentity(
  req: SalesRequest,
  res: Response,
  next: NextFunction
) {
  const match = /^Bearer (.+)$/i.exec(
    req.header('authorization') || ''
  );

  if (!match) {
    return res.status(401).json({
      message: 'Login required.',
    });
  }

  try {
    const { data, error } =
      await salesAuth.auth.getUser(match[1]);

    if (error || !data.user) {
      return res.status(401).json({
        message: 'Invalid session.',
      });
    }

    req.authUser = data.user;

    next();
  } catch {
    return res.status(401).json({
      message: 'Unable to verify identity.',
    });
  }
}

export async function requireSalesUser(
  req: SalesRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { data, error } = await salesDb
      .from('sales_users')
      .select('id,email,role,is_active')
      .eq('id', req.authUser!.id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        message: 'Unable to verify sales access.',
      });
    }

    if (!data || !data.is_active) {
      return res.status(403).json({
        message: 'Sales platform access denied.',
      });
    }

    req.salesUser = data;

    next();
  } catch {
    return res.status(500).json({
      message: 'Unable to verify sales access.',
    });
  }
}

export function requireSalesAdmin(
  req: SalesRequest,
  res: Response,
  next: NextFunction
) {
  if (
    !req.salesUser?.is_active ||
    req.salesUser.role !== 'admin'
  ) {
    return res.status(403).json({
      message: 'Administrator access required.',
    });
  }

  next();
}