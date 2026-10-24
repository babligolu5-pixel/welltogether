import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCentreById } from '../lib/catalogue';
import { useEnquiry } from '../lib/enquiryContext';
import { usePageMeta } from '../lib/seo';
import NotFound from './NotFound';

const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function CentreProfile() {
  const { id = '' } = useParams();
  const centre = getCentreById(id);
  const openEnquiry = useEnquiry();
  const [imageFailed, setImageFailed] = useState(false);

  usePageMeta(
    centre ? `${centre.name}, ${centre.city} — WellTogether` : 'Centre not found — WellTogether',
    centre
      ? `${centre.name} in ${centre.city}: services, ratings and starting prices on WellTogether. Send one enquiry to compare options calmly.`
      : 'This centre could not be found on WellTogether.',
  );

  if (!centre) {
    return <NotFound />;
  }

  return (
    <section
      className="section page"
      data-testid="centre-profile"
      data-centre={centre.id}
      aria-labelledby="profile-title"
    >
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/centres">Centres</Link>
          <span aria-hidden="true">/</span>
          <span>{centre.name}</span>
        </nav>

        <div className="profile-layout">
          <div className="profile-media">
            {imageFailed ? (
              <div className="centre-photo-fallback" data-testid="centre-photo-fallback">
                <span>{centre.name.slice(0, 2).toUpperCase()}</span>
                <span className="sr-only">{`${centre.name}, ${centre.city}`}</span>
              </div>
            ) : (
              <img
                src={`/centres/${centre.id}.svg`}
                alt={`${centre.name}, ${centre.city}`}
                width={800}
                height={600}
                data-testid="centre-photo"
                onError={() => setImageFailed(true)}
              />
            )}
            <span className="demo-badge profile-badge">Demo listing</span>
          </div>

          <div className="profile-body">
            <span className="eyebrow">{centre.city}</span>
            <h1 id="profile-title" className="page-title">
              {centre.name}
            </h1>

            <p className="profile-rating">
              <span
                className="rating"
                aria-label={`Rated ${centre.rating} out of 5 from ${centre.reviewCount} reviews`}
              >
                <span aria-hidden="true">★</span>
                {centre.rating.toFixed(1)}
              </span>
              <span className="profile-reviews">({centre.reviewCount} reviews)</span>
              <span className="price">From {inr(centre.priceFrom)}</span>
            </p>

            <p className="profile-note">{centre.note}</p>

            <h2 className="profile-subtitle">Services</h2>
            <div className="chips">
              {centre.services.map((service) => (
                <span key={service} className="chip">
                  {service}
                </span>
              ))}
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="btn btn-primary"
                data-testid="centre-enquire"
                onClick={() =>
                  openEnquiry({
                    centreId: centre.id,
                    centreName: centre.name,
                    service: centre.services[0] ?? 'Not sure yet',
                  })
                }
              >
                Enquire about this centre
              </button>
              <Link to="/centres" className="btn btn-ghost">
                Back to all centres
              </Link>
            </div>

            <p className="form-footnote">
              Demo listing: this centre is sample data for the preview, not a real
              partner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
