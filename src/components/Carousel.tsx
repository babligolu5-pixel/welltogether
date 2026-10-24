import { HERO_SLIDES } from '../data/site';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { useEffect, useState } from 'react';

export default function Carousel() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const total = HERO_SLIDES.length;
  const autoplay = !reduced && !paused && !hovered;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [autoplay, total]);

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const slide = HERO_SLIDES[index];

  return (
    <div
      className="carousel"
      data-testid="hero-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="Wellness services highlights"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(index + 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(index - 1);
        }
      }}
    >
      <div className="carousel-head">
        <span className="carousel-label">What you will find</span>
        <span className="carousel-counter" data-testid="slide-counter">
          {index + 1} / {total}
        </span>
      </div>

      <div
        className="slide"
        data-testid="hero-slide"
        aria-live={autoplay ? 'off' : 'polite'}
      >
        <h2>{slide.title}</h2>
        <p>{slide.body}</p>
      </div>

      <div className="carousel-controls">
        <div className="carousel-nav">
          <button
            type="button"
            className="round-btn"
            aria-label="Previous slide"
            data-testid="carousel-prev"
            onClick={() => go(index - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="round-btn"
            aria-label="Next slide"
            data-testid="carousel-next"
            onClick={() => go(index + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="dots" role="tablist" aria-label="Choose a highlight">
          {HERO_SLIDES.map((item, dotIndex) => (
            <button
              key={item.title}
              type="button"
              className="dot"
              role="tab"
              aria-label={`Show slide ${dotIndex + 1}: ${item.title}`}
              aria-current={dotIndex === index}
              data-testid="carousel-dot"
              onClick={() => go(dotIndex)}
            />
          ))}
        </div>

        <button
          type="button"
          className="round-btn"
          aria-pressed={paused || reduced}
          aria-label={paused ? 'Resume automatic slides' : 'Pause automatic slides'}
          data-testid="carousel-pause"
          onClick={() => setPaused((value) => !value)}
        >
          <span aria-hidden="true">{paused || reduced ? '▶' : '❚❚'}</span>
        </button>
      </div>

      <span className="sr-only" data-testid="carousel-state">
        {autoplay ? 'playing' : 'paused'}
      </span>
    </div>
  );
}
