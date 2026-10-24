import { SERVICES } from '../data/site';
import ServiceIcon from './ServiceIcon';

interface Props {
  onEnquire: (service: string) => void;
}

export default function ServiceCategories({ onEnquire }: Props) {
  return (
    <section className="section" id="services" data-testid="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Service categories</span>
          <h2 id="services-title">Six traditions, one calm starting point</h2>
          <p>
            Pick the practice you are curious about. Each category lists centres that
            actually offer it, with clear inclusions and honest pricing.
          </p>
        </div>

        <div className="category-grid" data-testid="category-grid">
          {SERVICES.map((service) => (
            <button
              key={service.slug}
              type="button"
              className="card category-card"
              data-testid="category-card"
              data-service={service.slug}
              onClick={() => onEnquire(service.name)}
            >
              <ServiceIcon name={service.icon} />
              <h3>{service.name}</h3>
              <p>{service.blurb}</p>
              <span className="chip">Enquire about {service.name.toLowerCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
