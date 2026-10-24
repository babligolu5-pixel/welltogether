import Hero from '../components/Hero';
import ServiceCategories from '../components/ServiceCategories';
import FeaturedCentres from '../components/FeaturedCentres';
import HowItWorks from '../components/HowItWorks';
import Reviews from '../components/Reviews';
import { usePageMeta } from '../lib/seo';

export default function Home() {
  usePageMeta(
    'WellTogether — Find Your Calm | Wellness Marketplace',
    'WellTogether is a wellness marketplace to explore, compare and enquire with yoga, meditation, Ayurveda, Panchkarma, Ayurvedic spa and natural wellness centres across India.',
  );

  return (
    <>
      <Hero />
      <ServiceCategories />
      <FeaturedCentres />
      <HowItWorks />
      <Reviews />
    </>
  );
}
