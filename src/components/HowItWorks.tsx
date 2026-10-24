import { STEPS } from '../data/site';

export default function HowItWorks() {
  return (
    <section
      className="section"
      id="how-it-works"
      data-testid="how-it-works"
      aria-labelledby="how-title"
    >
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 id="how-title">Three calm steps</h2>
          <p>WellTogether is a discovery platform. You enquire, the centre replies, you decide.</p>
        </div>

        <ol className="steps" data-testid="steps">
          {STEPS.map((step, index) => (
            <li className="step" data-testid="step" key={step.title}>
              <span className="step-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
