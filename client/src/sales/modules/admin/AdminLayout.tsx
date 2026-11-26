import React from 'react';

import {
  NavLink,
  Outlet,
} from 'react-router-dom';

import {
  Users,
  Layers,
  FileText,
  GraduationCap,
  Settings,
} from 'lucide-react';

import './admin.scss';

const navigation = [
  {
    label: 'Users',
    path: '/sales/admin/users',
    icon: Users,
  },
  {
    label: 'Materials',
    path: '/sales/admin/materials',
    icon: Layers,
  },
  {
    label: 'Training',
    path: '/sales/admin/training',
    icon: GraduationCap,
  },
  {
    label: 'Content',
    path: '/sales/admin/content',
    icon: FileText,
  },
  {
    label: 'Settings',
    path: '/sales/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout() {
  return (
    <div className="sales-admin">

      <div className="sales-page-heading">
        <h1>Administration</h1>
        <p>
          Manage users, content and platform settings.
        </p>
      </div>

      <nav
        className="sales-admin-nav"
        aria-label="Administration navigation"
      >
        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <Outlet />

    </div>
  );
}