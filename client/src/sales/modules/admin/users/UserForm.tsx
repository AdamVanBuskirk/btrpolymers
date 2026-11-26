import React, { useState } from 'react';
import { X } from 'lucide-react';

import {
  ManagedUser,
  UserInput,
} from './usersApi';

interface Props {
  user: ManagedUser | null;
  currentUserId?: string;
  onSave: (input: UserInput) => Promise<void>;
  onClose: () => void;
}

export default function UserForm({
  user,
  currentUserId,
  onSave,
  onClose,
}: Props) {
  const [input, setInput] = useState<UserInput>({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    role: user?.role || 'employee',
    is_active: user?.is_active ?? true,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isSelf =
    user?.type === 'user' &&
    user.id === currentUserId;

  function update<K extends keyof UserInput>(
    key: K,
    value: UserInput[K]
  ) {
    setInput(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setBusy(true);
    setError('');

    try {
      await onSave(input);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save user.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sales-admin-form">

      <div className="sales-admin-form-header">

        <div>
          <h2>
            {user ? 'Edit User' : 'Add User'}
          </h2>

          <p>
            {user
              ? 'Update employee information and access.'
              : 'Preauthorize an employee to sign in with Google.'}
          </p>
        </div>

        <button
          type="button"
          className="sales-admin-icon-button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close user form"
        >
          <X size={22} />
        </button>

      </div>

      <form onSubmit={submit}>

        <div className="sales-admin-form-grid">

          <label>
            First name
            <input
              required
              maxLength={100}
              value={input.first_name}
              onChange={e =>
                update('first_name', e.target.value)
              }
            />
          </label>

          <label>
            Last name
            <input
              required
              maxLength={100}
              value={input.last_name}
              onChange={e =>
                update('last_name', e.target.value)
              }
            />
          </label>

        </div>

        <label>
          Email address
          <input
            type="email"
            required
            disabled={!!user}
            placeholder="employee@btrpolymers.com"
            value={input.email}
            onChange={e =>
              update('email', e.target.value)
            }
          />
        </label>

        <label>
          Role
          <select
            value={input.role}
            disabled={isSelf}
            onChange={e =>
              update(
                'role',
                e.target.value as UserInput['role']
              )
            }
          >
            <option value="employee">
              Employee
            </option>
            <option value="admin">
              Administrator
            </option>
          </select>
        </label>

        {user && (
          <label className="sales-admin-checkbox">
            <input
              type="checkbox"
              checked={input.is_active}
              disabled={isSelf}
              onChange={e =>
                update('is_active', e.target.checked)
              }
            />
            Account enabled
          </label>
        )}

        {!user && (
          <div className="sales-admin-note">
            This employee will be authorized to
            access the platform the first time they
            sign in with their Google Workspace
            account. No password or email invitation
            is required.
          </div>
        )}

        {error && (
          <p role="alert" className="sales-error">
            {error}
          </p>
        )}

        <div className="sales-admin-form-actions">

          <button
            type="button"
            className="sales-admin-secondary"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="sales-admin-primary"
            disabled={busy}
          >
            {busy
              ? 'Saving...'
              : user
                ? 'Save Changes'
                : 'Add User'}
          </button>

        </div>

      </form>

    </div>
  );
}