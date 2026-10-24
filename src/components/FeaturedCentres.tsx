import { CENTRES } from '../data/site';

interface Props {
  onEnquire: (centre: { id: string; name: string; service: string }) => void;
}

const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function FeaturedCentres({ onEnquire }: Props) {
  return (
    <section
      className="section section-alt"
      id="centres"
      data-testid="centres"
      aria-labelledby="centres-title"
    >
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Featured centres</span>
          <h2 id="centres-title">A first look at what is out there</h2>
          <p>
            Compare location, services and starting prices before you spend time on a
            call.
          </p>
        </div>

        <p className="demo-note" data-testid="demo-note">
          <span className="demo-badge">Demo</span>
          <span>
            The centres below are illustrative samples created for this preview. They
            are not real listings yet.
          </span>
        </p>

        <div className="centre-grid" data-testid="centre-grid">
          {CENTRES.map((centre) => (
            <article
              key={centre.id}
              className="card centre-card"
              data-testid="centre-card"
              data-centre={centre.id}
            >
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
                  onClick={() =>
                    onEnquire({
                      id: centre.id,
                      name: centre.name,
                      service: centre.services[0] ?? 'Not sure yet',
                    })
                  }
                >
                  Enquire
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
