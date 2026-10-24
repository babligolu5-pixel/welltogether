import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CentresPage from './pages/CentresPage';
import ServicePage from './pages/ServicePage';
import NotFound from './pages/NotFound';
import { EnquiryContext } from './lib/enquiryContext';
import type { EnquiryTarget } from './lib/types';

// Firebase only ships when someone opens the enquiry form.
const EnquiryDialog = lazy(() => import('./components/EnquiryDialog'));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [enquiry, setEnquiry] = useState<EnquiryTarget | null>(null);
  const openEnquiry = (target: EnquiryTarget = {}) => setEnquiry(target);

  return (
    <BrowserRouter>
      <EnquiryContext.Provider value={openEnquiry}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <ScrollManager />
        <Header onEnquire={() => openEnquiry()} />

        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/centres" element={<CentresPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {enquiry !== null && (
          <Suspense fallback={null}>
            <EnquiryDialog open target={enquiry} onClose={() => setEnquiry(null)} />
          </Suspense>
        )}      </EnquiryContext.Provider>
    </BrowserRouter>
  );
}
