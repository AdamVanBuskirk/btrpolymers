import React from 'react';

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  SalesAuthProvider,
} from './core/auth/SalesAuthProvider';

import SalesProtectedRoute
  from './core/auth/SalesProtectedRoute';

import SalesLogin
  from './core/auth/SalesLogin';

import SalesLayout
  from './core/layout/SalesLayout';

import SalesDashboard
  from './modules/dashboard/SalesDashboard';

import SalesComingSoon
  from './core/components/SalesComingSoon';

  import AdminLayout
  from './modules/admin/AdminLayout';

import UserManagement
  from './modules/admin/users/UserManagement';

import './core/styles/sales.scss';
import './core/styles/sales-layout.scss';

const futureModules = [
  {
    path: 'materials',
    title: 'Material Library',
    description:
      'Identify and qualify post-industrial plastic scrap.',
  },
  {
    path: 'training',
    title: 'Training Catalog',
    description:
      'Develop your knowledge and sales skills.',
  },
  {
    path: 'pricing',
    title: 'Pricing Calculator',
    description:
      'Calculate material purchase prices and profitability.',
  },
  {
    path: 'selling-streams',
    title: 'Selling Stream Matrix',
    description:
      'Match qualified materials with customer requirements.',
  },
  {
    path: 'mock-calls',
    title: 'Mock Calls',
    description:
      'Practice supplier discovery and sales conversations.',
  },
  {
    path: 'videos',
    title: 'Videos',
    description:
      'Explore our video training library.',
  },
  {
    path: 'images',
    title: 'Images',
    description:
      'Explore material and manufacturing reference images.',
  },
  {
    path: 'resources',
    title: 'Text Resources',
    description:
      'Access sales guides, playbooks and reference materials.',
  },
  {
    path: 'practice',
    title: 'Interactive Practice',
    description:
      'Test and improve your plastics recycling knowledge.',
  },
];

export default function SalesApp() {
  return (
    <div className="btr-sales">

      <SalesAuthProvider>

        <Routes>

          <Route
            path="login"
            element={<SalesLogin />}
          />

          <Route element={<SalesProtectedRoute />}>

            <Route element={<SalesLayout />}>

              <Route
                index
                element={<SalesDashboard />}
              />

              {futureModules.map(module => (
                <Route
                  key={module.path}
                  path={module.path}
                  element={
                    <SalesComingSoon
                      title={module.title}
                      description={module.description}
                    />
                  }
                />
              ))}

<Route element={<SalesProtectedRoute adminOnly />}>

  <Route path="admin" element={<AdminLayout />}>

    <Route
      index
      element={<Navigate to="users" replace />}
    />

    <Route
      path="users"
      element={<UserManagement />}
    />

    <Route
      path="materials"
      element={
        <SalesComingSoon
          title="Material Administration"
          description="Manage resin families, grades and scrap forms."
        />
      }
    />

    <Route
      path="training"
      element={
        <SalesComingSoon
          title="Training Administration"
          description="Manage training courses and learning paths."
        />
      }
    />

    <Route
      path="content"
      element={
        <SalesComingSoon
          title="Content Administration"
          description="Manage videos, images and text resources."
        />
      }
    />

    <Route
      path="settings"
      element={
        <SalesComingSoon
          title="Platform Settings"
          description="Manage sales platform configuration."
        />
      }
    />

  </Route>

</Route>

            </Route>

          </Route>

          <Route
            path="*"
            element={
              <Navigate to="/sales" replace />
            }
          />

        </Routes>

      </SalesAuthProvider>

    </div>
  );
}