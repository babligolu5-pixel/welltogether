import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Centre } from '../data/site';

interface Props {
  centre: Centre;
  onEnquire: (centre: Centre) => void;
}

const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const initials = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export default function CentreCard({ centre, onEnquire }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="card centre-card" data-testid="centre-card" data-centre={centre.id}>
      <div className="centre-photo">
        {imageFailed ? (
          <div className="centre-photo-fallback" data-testid="centre-photo-fallback">
            <span aria-hidden="true">{initials(centre.name)}</span>
            <span className="sr-only">{`${centre.name}, ${centre.city}`}</span>
          </div>
        ) : (
          <img
            src={`/centres/${centre.id}.svg`}
            alt={`${centre.name}, ${centre.city}`}
            width={800}
            height={600}
            loading="lazy"
            data-testid="centre-photo"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="demo-badge centre-photo-badge">Demo</span>
      </div>

      <div className="card-head">
        <div>
          <h3 className="centre-name">{centre.name}</h3>
          <p className="centre-city">{centre.city}</p>
        </div>
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

      <div className="card-actions card-actions-split">
        <Link
          to={`/centres/${centre.id}`}
          className="btn btn-primary btn-small"
          data-testid="centre-view-profile"
        >
          View Profile
        </Link>
        <button
          type="button"
          className="btn-link"
          data-testid="centre-enquire"
          onClick={() => onEnquire(centre)}
        >
          Enquire
        </button>
      </div>
    </article>
  );
}
