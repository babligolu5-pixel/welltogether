import { useState } from 'react';
import Header, { type EnquiryTarget } from './components/Header';
import Hero from './components/Hero';
import ServiceCategories from './components/ServiceCategories';
import FeaturedCentres from './components/FeaturedCentres';
import HowItWorks from './components/HowItWorks';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import EnquiryDialog from './components/EnquiryDialog';

export default function App() {
  const [enquiry, setEnquiry] = useState<EnquiryTarget | null>(null);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header onEnquire={() => setEnquiry({})} />

      <main id="main">
        <Hero />
        <ServiceCategories onEnquire={(service) => setEnquiry({ service })} />
        <FeaturedCentres
          onEnquire={(centre) =>
            setEnquiry({
              centreId: centre.id,
              centreName: centre.name,
              service: centre.service,
            })
          }
        />
        <HowItWorks />
        <Reviews />
      </main>

      <Footer />

      <EnquiryDialog
        open={enquiry !== null}
        target={enquiry ?? {}}
        onClose={() => setEnquiry(null)}
      />
    </>
  );
}
