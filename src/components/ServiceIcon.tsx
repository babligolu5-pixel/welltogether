import type { ServiceIcon as IconName } from '../data/site';

const PATHS: Record<IconName, string> = {
  lotus: 'M12 20c3.5 0 6.5-2.2 6.5-5.4-2.6.2-4.7 1.2-6.5 3-1.8-1.8-3.9-2.8-6.5-3C5.5 17.8 8.5 20 12 20Zm0 0c-4.2-2.4-5.6-6-5.6-9.3 2 .5 3.9 1.6 5.6 3.4 1.7-1.8 3.6-2.9 5.6-3.4 0 3.3-1.4 6.9-5.6 9.3Z',
  wave: 'M3 15c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2M3 9c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2',
  leaf: 'M20 4c-8 0-14 3-14 9a5 5 0 0 0 5 5c6 0 9-6 9-14ZM6 18l6-6',
  drop: 'M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3Z',
  stone: 'M4 16.5c0-2.2 2.6-4 6-4h4c3.4 0 6 1.8 6 4s-2.6 4-6 4h-4c-3.4 0-6-1.8-6-4Zm3-6c0-1.7 1.8-3 4-3s4 1.3 4 3',
  sun: 'M12 4v2m0 12v2M4 12h2m12 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4M7.7 16.3l-1.4 1.4M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z',
};

export default function ServiceIcon({ name }: { name: IconName }) {
  return (
    <span className="icon-wrap" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={PATHS[name]} />
      </svg>
    </span>
  );
}
