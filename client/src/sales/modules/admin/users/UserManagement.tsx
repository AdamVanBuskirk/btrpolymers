import React, {
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  Search,
  Pencil,
  UserMinus,
  UserCheck,
  Users,
  Clock,
  RefreshCw,
} from 'lucide-react';

import {
  useSalesAuth,
} from '../../../core/auth/SalesAuthProvider';

import {
  ManagedUser,
  UserInput,
  usersApi,
} from './usersApi';

import UserForm from './UserForm';

function getStatus(user: ManagedUser) {
  if (!user.is_active) return 'Inactive';

  return user.type === 'invitation'
    ? 'Pending'
    : 'Active';
}

export default function UserManagement() {
  const { profile } = useSalesAuth();

  const [users, setUsers] =
    useState<ManagedUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<ManagedUser | null>(null);

  const [busy, setBusy] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      setUsers(await usersApi.list());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load users.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const query = search.trim().toLowerCase();

    const text = [
      user.first_name,
      user.last_name,
      user.email,
    ].join(' ').toLowerCase();

    return (
      text.includes(query) &&
      (
        status === 'all' ||
        getStatus(user).toLowerCase() === status
      ) &&
      (
        role === 'all' ||
        user.role === role
      )
    );
  });

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
    },
    {
      label: 'Active Users',
      value: users.filter(
        u => getStatus(u) === 'Active'
      ).length,
      icon: UserCheck,
    },
    {
      label: 'Pending Users',
      value: users.filter(
        u => getStatus(u) === 'Pending'
      ).length,
      icon: Clock,
    },
    {
      label: 'Inactive Users',
      value: users.filter(
        u => getStatus(u) === 'Inactive'
      ).length,
      icon: UserMinus,
    },
  ];

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
    setNotice('');
  }

  function openEdit(user: ManagedUser) {
    setEditing(user);
    setFormOpen(true);
    setNotice('');
  }

  async function save(input: UserInput) {
    if (editing) {
      await usersApi.update(editing, input);
      setNotice('User updated successfully.');
    } else {
      await usersApi.create(input);
      setNotice('Employee authorized successfully.');
    }

    await loadUsers();
  }

  async function remove(user: ManagedUser) {
    const action =
      user.type === 'invitation'
        ? 'remove the invitation for'
        : 'deactivate';

    if (!window.confirm(
      `Are you sure you want to ${action} ${user.email}?`
    )) return;

    setBusy(true);
    setError('');
    setNotice('');

    try {
      await usersApi.remove(user);

      setNotice(
        user.type === 'invitation'
          ? 'Invitation removed.'
          : 'User deactivated.'
      );

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove user.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function reactivate(user: ManagedUser) {
    setBusy(true);
    setError('');
    setNotice('');

    try {
      await usersApi.update(user, {
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role,
        is_active: true,
      });

      setNotice('User reactivated.');

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reactivate user.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sales-user-management">

      <div className="sales-admin-heading">

        <div>
          <h2>User Management</h2>
          <p>
            Manage employee access and permissions.
          </p>
        </div>

        <button
          className="sales-admin-primary"
          onClick={openAdd}
          disabled={busy || loading}
        >
          <Plus size={19} />
          Add User
        </button>

      </div>

      <div className="sales-admin-stats">

        {stats.map(stat => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="sales-admin-stat"
            >
              <div>
                <span>{stat.label}</span>
                <strong>
                  {loading || error ? '—' : stat.value}
                </strong>
              </div>

              <Icon size={26} />
            </div>
          );
        })}

      </div>

      {error && (
        <div role="alert" className="sales-admin-error">
          {error}
        </div>
      )}

      {notice && (
        <div role="status" className="sales-admin-notice">
          {notice}
        </div>
      )}

      {formOpen && (
        <UserForm
          key={editing?.id || 'new'}
          user={editing}
          currentUserId={profile?.id}
          onSave={save}
          onClose={() => setFormOpen(false)}
        />
      )}

      <section className="sales-admin-table-card">

        <div className="sales-admin-filters">

          <div className="sales-admin-search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Search users"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            aria-label="Filter by role"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="admin">Administrators</option>
            <option value="employee">Employees</option>
          </select>

          <button
            className="sales-admin-secondary"
            onClick={loadUsers}
            disabled={loading || busy}
            aria-label="Refresh users"
          >
            <RefreshCw size={17} />
          </button>

        </div>

        {loading ? (
          <div className="sales-admin-empty">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="sales-admin-empty">
            {error
              ? 'Unable to display users.'
              : 'No matching users found.'}
          </div>
        ) : (
          <div className="sales-admin-table-scroll">

            <table className="sales-admin-table">

              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map(user => {
                  const userStatus = getStatus(user);

                  const isSelf =
                    user.type === 'user' &&
                    user.id === profile?.id;

                  return (
                    <tr key={`${user.type}-${user.id}`}>

                      <td>
                        <strong>
                          {[
                            user.first_name,
                            user.last_name,
                          ].filter(Boolean).join(' ')
                            || user.email}

                          {isSelf && ' (You)'}
                        </strong>

                        <small>{user.email}</small>
                      </td>

                      <td>
                        {user.role === 'admin'
                          ? 'Administrator'
                          : 'Employee'}
                      </td>

                      <td>
                        <span
                          className={
                            `sales-user-status ${
                              userStatus.toLowerCase()
                            }`
                          }
                        >
                          {userStatus}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <div className="sales-user-actions">

                          <button
                            onClick={() => openEdit(user)}
                            disabled={busy}
                            title="Edit user"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          {!isSelf && (
                            user.type === 'invitation' ||
                            user.is_active
                              ? (
                                <button
                                  className="danger"
                                  disabled={busy}
                                  onClick={() => remove(user)}
                                >
                                  <UserMinus size={15} />

                                  {user.type === 'invitation'
                                    ? 'Remove'
                                    : 'Deactivate'}
                                </button>
                              )
                              : (
                                <button
                                  disabled={busy}
                                  onClick={() =>
                                    reactivate(user)
                                  }
                                >
                                  <UserCheck size={15} />
                                  Reactivate
                                </button>
                              )
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

        <div className="sales-admin-table-footer">
          Showing {filteredUsers.length} of {users.length} users
        </div>

      </section>

    </div>
  );
}