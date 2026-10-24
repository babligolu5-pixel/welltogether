import { useState } from 'react';
import { useMediaQuery } from '../lib/useMediaQuery';

interface HeaderProps {
  onEnquire: () => void;
}

export type EnquiryTarget = {
  service?: string;
  centreId?: string;
  centreName?: string;
};

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#centres', label: 'Centres' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#reviews', label: 'Reviews' },
];

export default function Header({ onEnquire }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const wide = useMediaQuery('(min-width: 861px)');
  const panelOpen = open && !wide;

  return (
    <header className="site-header" data-testid="site-header">
      <div className="container header-inner">
        <a className="wordmark" href="#hero">
          <span className="wordmark-dot" aria-hidden="true" />
          WellTogether
        </a>

        <nav
          className="nav"
          id="primary-nav"
          data-testid="primary-nav"
          aria-label="Primary"
          data-open={panelOpen ? 'true' : 'false'}
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
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
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true">{panelOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
