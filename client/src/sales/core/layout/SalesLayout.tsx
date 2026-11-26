import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import SalesSidebar from './SalesSidebar';
import SalesHeader from './SalesHeader';

export default function SalesLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="sales-layout">

      <SalesSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          className="sales-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div className="sales-main">

        <SalesHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="sales-page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}