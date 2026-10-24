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
          <h2 id="how-title">Four quiet steps, no pressure</h2>
          <p>WellTogether is a discovery platform. You enquire, the centre replies, you decide.</p>
        </div>

        <ol className="steps" data-testid="steps">
          {STEPS.map((step) => (
            <li className="step" data-testid="step" key={step.title}>
              <span className="step-index" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
