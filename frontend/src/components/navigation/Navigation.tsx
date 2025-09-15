import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { NavigationItem } from './types';

const navigationItems: NavigationItem[] = [
  { key: 'home', label: 'Home', path: '/welcome' },
  { key: 'products', label: 'Products', path: '/products' }
];

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span>AI Coding</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="nav-toggle-icon"></span>
          <span className="nav-toggle-icon"></span>
          <span className="nav-toggle-icon"></span>
        </button>

        {/* Navigation menu */}
        <div
          id="nav-menu"
          className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}
        >
          <ul className="nav-links" role="list">
            {navigationItems.map((item) => (
              <li key={item.key} role="listitem">
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `nav-link ${isActive ? 'nav-link-active active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-user">
            {user && (
              <span className="nav-user-info" aria-label={`Logged in as ${user.email}`}>
                {user.email}
              </span>
            )}
            <button
              className="nav-logout"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;