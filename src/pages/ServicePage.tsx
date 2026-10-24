import { Link, useParams } from 'react-router-dom';
import CentreCard from '../components/CentreCard';
import { findMenuCategory, getCentresByService } from '../lib/catalogue';
import { useEnquiry } from '../lib/enquiryContext';
import { usePageMeta } from '../lib/seo';
import NotFound from './NotFound';

export default function ServicePage() {
  const { slug = '' } = useParams();
  const category = findMenuCategory(slug);

  if (!category) {
    return <NotFound />;
  }

  return <ServiceCategoryView slug={slug} label={category.label} intro={category.intro} service={category.service} />;
}

function ServiceCategoryView({
  slug,
  label,
  intro,
  service,
}: {
  slug: string;
  label: string;
  intro: string;
  service: string;
}) {
  const openEnquiry = useEnquiry();
  const centres = getCentresByService(service);

  usePageMeta(
    `${label} centres — WellTogether`,
    `Find ${label.toLowerCase()} centres on WellTogether. Compare locations, prices and what each programme includes before you enquire.`,
  );

  return (
    <section
      className="section page"
      data-testid="service-page"
      data-service={slug}
      aria-labelledby="service-title"
    >
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/centres">Centres</Link>
          <span aria-hidden="true">/</span>
          <span>{label}</span>
        </nav>

        <div className="section-head">
          <span className="eyebrow">Service</span>
          <h1 id="service-title" className="page-title">
            {label} centres
          </h1>
          <p>{intro}</p>
          <p className="page-count" data-testid="service-count">
            {centres.length} {centres.length === 1 ? 'centre' : 'centres'}
          </p>
        </div>

        {centres.length === 0 ? (
          <div className="empty-state" data-testid="service-empty">
            <h2>No centres listed yet</h2>
            <p>We are onboarding {label.toLowerCase()} centres in this region right now.</p>
            <Link to="/centres" className="btn btn-primary">
              Browse all centres
            </Link>
          </div>
        ) : (
          <div className="centre-grid" data-testid="centre-grid">
            {centres.map((centre) => (
              <CentreCard
                key={centre.id}
                centre={centre}
                onEnquire={(item) =>
                  openEnquiry({
                    centreId: item.id,
                    centreName: item.name,
                    service,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
