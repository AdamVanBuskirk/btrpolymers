import React from 'react';
import { NavLink } from 'react-router-dom';
import { HelpCircle, X } from 'lucide-react';

import { useSalesAuth } from '../auth/SalesAuthProvider';
import { salesNavigation } from '../navigation/salesNavigation';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SalesSidebar({
  open,
  onClose,
}: Props) {
  const { isAdmin } = useSalesAuth();

  return (
    <aside
      className={`sales-sidebar ${open ? 'is-open' : ''}`}
    >
      <div className="sales-sidebar-brand">

        <NavLink to="/sales" onClick={onClose}>
          <img
            src="/images/btr-green-arrow.gif"
            alt="BTR Polymers"
          />
        </NavLink>

        <div className="sales-sidebar-subtitle">
          SALES PLATFORM
        </div>

        <button
          className="sales-mobile-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={22} />
        </button>

      </div>

      <nav
        className="sales-sidebar-nav"
        aria-label="Sales navigation"
      >
        {salesNavigation
          .filter(item => !item.adminOnly || isAdmin)
          .map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `sales-nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />

                <span>{item.label}</span>

              </NavLink>
            );
          })}
      </nav>

      <div className="sales-sidebar-bottom">

        <div className="sales-help-card">

          <div className="sales-help-title">
            <HelpCircle size={19} />
            Need help?
          </div>

          <p>
            Reach out to your manager for support
            with training or sales tools.
          </p>

        </div>

        <div className="sales-sidebar-copyright">
          © {new Date().getFullYear()} BTR Polymers
        </div>

      </div>

    </aside>
  );
}