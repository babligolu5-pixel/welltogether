import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/seo';

export default function NotFound() {
  usePageMeta(
    'Page not found — WellTogether',
    'The page you were looking for does not exist. Browse wellness centres or return to the WellTogether home page.',
  );

  return (
    <section className="section page" data-testid="not-found" aria-labelledby="not-found-title">
      <div className="container empty-state">
        <span className="eyebrow">404</span>
        <h1 id="not-found-title" className="page-title">
          This page took a quiet detour
        </h1>
        <p>We could not find that page. The rest of the site is still here.</p>
        <Link to="/" className="btn btn-primary" data-testid="back-home">
          Back to home
        </Link>
      </div>
    </section>
  );
}
