import type { Centre } from '../data/site';

interface Props {
  centre: Centre;
  onEnquire: (centre: Centre) => void;
}

const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function CentreCard({ centre, onEnquire }: Props) {
  return (
    <article className="card centre-card" data-testid="centre-card" data-centre={centre.id}>
      <div className="card-head">
        <div>
          <h3 className="centre-name">{centre.name}</h3>
          <p className="centre-city">{centre.city}</p>
        </div>
        <span className="demo-badge">Demo</span>
      </div>

      <p className="centre-note">{centre.note}</p>

      <div className="chips">
        {centre.services.map((service) => (
          <span key={service} className="chip">
            {service}
          </span>
        ))}
      </div>

      <p className="centre-meta">
        <span
          className="rating"
          aria-label={`Rated ${centre.rating} out of 5 from ${centre.reviewCount} reviews`}
        >
          <span aria-hidden="true">★</span>
          {centre.rating.toFixed(1)}
        </span>
        <span>({centre.reviewCount})</span>
        <span className="price">From {inr(centre.priceFrom)}</span>
      </p>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-ghost btn-small"
          data-testid="centre-enquire"
          onClick={() => onEnquire(centre)}
        >
          Enquire
        </button>
      </div>
    </article>
  );
}
