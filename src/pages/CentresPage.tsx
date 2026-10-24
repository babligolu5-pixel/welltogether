import { Link } from 'react-router-dom';
import CentreCard from '../components/CentreCard';
import { getCentres } from '../lib/catalogue';
import { useEnquiry } from '../lib/enquiryContext';
import { usePageMeta } from '../lib/seo';

export default function CentresPage() {
  const openEnquiry = useEnquiry();
  const centres = getCentres();

  usePageMeta(
    'Wellness Centres — WellTogether',
    'Browse wellness centres across India on WellTogether: yoga, meditation, Ayurveda, Panchkarma and Ayurvedic spa listings with ratings and starting prices.',
  );

  return (
    <section className="section page" data-testid="centres-page" aria-labelledby="centres-page-title">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Centres</span>
        </nav>

        <div className="section-head">
          <span className="eyebrow">Explore centres</span>
          <h1 id="centres-page-title" className="page-title">
            Wellness centres across India
          </h1>
          <p>
            Every listing below shows the services offered, a rating and a starting
            price, so you can compare before you enquire.
          </p>
          <p className="page-count" data-testid="centres-count">
            {centres.length} centres
          </p>
        </div>

        <p className="demo-note" data-testid="demo-note">
          <span className="demo-badge">Demo</span>
          <span>
            These listings are sample data for this preview. They are not real partner
            centres yet.
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
      </div>
    </section>
  );
}
