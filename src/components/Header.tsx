import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MENU_CATEGORIES } from '../data/site';
import { useMediaQuery } from '../lib/useMediaQuery';

interface HeaderProps {
  onEnquire: () => void;
}

export default function Header({ onEnquire }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const wide = useMediaQuery('(min-width: 861px)');
  const location = useLocation();
  const servicesRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const panelOpen = menuOpen && !wide;
  const servicesActive = location.pathname.startsWith('/services');

  // Route changes always close every menu.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname, location.hash]);

  // Close the services menu when clicking outside of it.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [servicesOpen]);

  // Escape works regardless of where focus sits (WebKit does not focus buttons on click).
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [servicesOpen]);

  const focusItem = (index: number) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (items.length === 0) return;
    const next = items[(index + items.length) % items.length];
    next.focus();
  };

  return (
    <header className="site-header" data-testid="site-header">
      <div className="container header-inner">
        <Link
          className="wordmark"
          to="/"
          data-testid="wordmark"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'auto' });
            }
          }}
        >
          <span className="wordmark-dot" aria-hidden="true" />
          WellTogether
        </Link>

        <nav
          className="nav"
          id="primary-nav"
          data-testid="primary-nav"
          aria-label="Primary"
          data-open={panelOpen ? 'true' : 'false'}
        >
          <NavLink
            to="/centres"
            className="nav-link"
            data-testid="nav-explore-centres"
            onClick={() => setMenuOpen(false)}
          >
            Explore Centres
          </NavLink>

          <div
            className="services"
            ref={servicesRef}
          >
            <button
              type="button"
              ref={triggerRef}
              className="nav-link services-trigger"
              data-testid="services-trigger"
              data-active={servicesActive ? 'true' : 'false'}
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen((value) => !value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setServicesOpen(true);
                  window.setTimeout(() => focusItem(0), 0);
                }
              }}
            >
              Services
              <span className="chevron" aria-hidden="true">
                ▾
              </span>
            </button>

            <ul
              className="services-panel"
              id="services-menu"
              data-testid="services-menu"
              role="menu"
              aria-label="Wellness services"
              hidden={!servicesOpen}
              onKeyDown={(event) => {
                const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
                const current = items.indexOf(document.activeElement as HTMLAnchorElement);
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  focusItem(current + 1);
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  focusItem(current - 1);
                } else if (event.key === 'Home') {
                  event.preventDefault();
                  focusItem(0);
                } else if (event.key === 'End') {
                  event.preventDefault();
                  focusItem(items.length - 1);
                }
              }}
            >
              {MENU_CATEGORIES.map((category, index) => (
                <li key={category.slug} role="none">
                  <Link
                    role="menuitem"
                    to={`/services/${category.slug}`}
                    className="services-item"
                    data-testid="services-item"
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    onClick={() => {
                      setServicesOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <span>{category.label}</span>
                    <span className="services-item-hint" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/#how-it-works"
            className="nav-link"
            data-testid="nav-how-it-works"
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            to="/#reviews"
            className="nav-link"
            data-testid="nav-reviews"
            onClick={() => setMenuOpen(false)}
          >
            Reviews
          </Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary btn-small header-cta"
            onClick={onEnquire}
          >
            Find a Centre
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={panelOpen}
            aria-controls="primary-nav"
            aria-label={panelOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true">{panelOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
