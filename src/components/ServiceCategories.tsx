import { Link } from 'react-router-dom';
import { MENU_CATEGORIES } from '../data/site';
import ServiceIcon from './ServiceIcon';

export default function ServiceCategories() {
  return (
    <section className="section" id="services" data-testid="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Explore services</span>
          <h2 id="services-title">Five traditions, one calm starting point</h2>
          <p>
            Pick the practice you are curious about. Each category opens the centres
            that actually offer it, with clear inclusions and honest pricing.
          </p>
        </div>

        <div className="category-grid" data-testid="category-grid">
          {MENU_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/services/${category.slug}`}
              className="card category-card"
              data-testid="category-card"
              data-service={category.slug}
            >
              <ServiceIcon name={category.icon} />
              <h3>{category.label}</h3>
              <p>{category.intro}</p>
              <span className="card-hint" aria-hidden="true">
                View centres →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
