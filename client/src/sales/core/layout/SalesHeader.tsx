import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  LogOut,
  Menu,
} from 'lucide-react';

import { useSalesAuth } from '../auth/SalesAuthProvider';

interface Props {
  onMenuClick: () => void;
}

export default function SalesHeader({
  onMenuClick,
}: Props) {
  const { profile, signOut } = useSalesAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = [
    profile?.first_name,
    profile?.last_name,
  ].filter(Boolean).join(' ') || 'Team Member';

  const initials = [
    profile?.first_name?.charAt(0),
    profile?.last_name?.charAt(0),
  ].filter(Boolean).join('').toUpperCase() || 'BT';

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      setError('Unable to sign out. Please try again.');
    }
  }

  return (
    <header className="sales-header">

      <div className="sales-header-left">

        <button
          className="sales-mobile-menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>

        <span className="sales-header-brand">
          BTR POLYMERS
        </span>

      </div>

      <div className="sales-header-right">

        <div
          className="sales-profile-wrapper"
          ref={menuRef}
        >

          <button
            className="sales-profile-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Account menu"
          >

            <div className="sales-avatar">
              {initials}
            </div>

            <div className="sales-profile-details">
              <strong>{fullName}</strong>

              <span>
                {profile?.role === 'admin'
                  ? 'Administrator'
                  : 'Employee'}
              </span>
            </div>

            <ChevronDown size={16} />

          </button>

          {menuOpen && (
            <div className="sales-profile-dropdown">

              <div className="sales-dropdown-account">
                <strong>{fullName}</strong>
                <span>{profile?.email}</span>
              </div>

              {error && (
                <p className="sales-error">
                  {error}
                </p>
              )}

              <button onClick={handleSignOut}>
                <LogOut size={17} />
                Sign out
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}