import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import { useEnquiry } from '../lib/enquiryContext';
import { useIsSmallScreen, usePrefersReducedMotion } from '../lib/useMediaQuery';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const navigate = useNavigate();
  const openEnquiry = useEnquiry();
  const reduced = usePrefersReducedMotion();
  const small = useIsSmallScreen();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero" data-testid="hero" aria-labelledby="hero-title">
      <Suspense fallback={null}>
        {sceneReady && <HeroScene reduced={reduced} small={small} />}
      </Suspense>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-panel" data-testid="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Wellness marketplace</span>
            <h1 id="hero-title">Find your calm, without the guesswork.</h1>
            <p className="hero-lead">
              Compare trusted wellness centres across India — yoga, meditation,
              Ayurveda, Panchkarma, Ayurvedic spa and natural wellness — then send a
              single, unhurried enquiry.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                data-testid="cta-explore"
                onClick={() => navigate('/centres')}
              >
                Explore Centres
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                data-testid="cta-find-centre"
                onClick={() => openEnquiry()}
              >
                Find a Centre
              </button>
            </div>

            <p className="hero-trust">
              <span>40+ cities</span>
              <span>Physician-led Ayurveda</span>
              <span>No booking pressure</span>
            </p>
          </div>

          <Carousel />
        </div>
      </div>
    </section>
  );
}
