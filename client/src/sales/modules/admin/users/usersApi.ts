import {
  salesRequest,
} from '../../../core/api/salesApi';

import {
  SalesUser,
} from '../../../core/auth/SalesAuthProvider';

export interface ManagedUser extends SalesUser {
  type: 'user' | 'invitation';
  created_at: string;
  updated_at: string;
}

export interface UserInput {
  email: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'admin';
  is_active: boolean;
}

export const usersApi = {
  list: () =>
    salesRequest<ManagedUser[]>(
      '/admin/users'
    ),

  create: (input: UserInput) =>
    salesRequest<ManagedUser>(
      '/admin/users',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    ),

  update: (
    user: ManagedUser,
    input: UserInput
  ) =>
    salesRequest<ManagedUser>(
      `/admin/users/${user.type}/${user.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      }
    ),

  remove: (user: ManagedUser) =>
    salesRequest<void>(
      `/admin/users/${user.type}/${user.id}`,
      {
        method: 'DELETE',
      }
    ),
};