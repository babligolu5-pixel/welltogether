import { Link } from 'react-router-dom';
import { getCentres } from '../lib/catalogue';
import { useEnquiry } from '../lib/enquiryContext';
import CentreCard from './CentreCard';

const HOME_LIMIT = 6;

export default function FeaturedCentres() {
  const openEnquiry = useEnquiry();
  const centres = getCentres().slice(0, HOME_LIMIT);

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
          {centres.map((centre) => (
            <CentreCard
              key={centre.id}
              centre={centre}
              onEnquire={(item) =>
                openEnquiry({
                  centreId: item.id,
                  centreName: item.name,
                  service: item.services[0] ?? 'Not sure yet',
                })
              }
            />
          ))}
        </div>

        <p className="section-more">
          <Link to="/centres" className="btn btn-ghost" data-testid="browse-all-centres">
            Browse all centres
          </Link>
        </p>
      </div>
    </section>
  );
}
