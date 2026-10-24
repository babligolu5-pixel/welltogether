import { REVIEWS } from '../data/site';

const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export default function Reviews() {
  return (
    <section
      className="section section-alt"
      id="reviews"
      data-testid="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Reviews</span>
          <h2 id="reviews-title">What a calmer search feels like</h2>
          <p>Short notes from early testers about the experience of comparing centres.</p>
        </div>

        <p className="demo-note">
          <span className="demo-badge">Demo</span>
          <span>These reviews are sample content for this preview, not verified testimonials.</span>
        </p>

        <div className="review-grid">
          {REVIEWS.map((review) => (
            <article className="card review-card" data-testid="review-card" key={review.id}>
              <span className="stars" aria-label={`Rated ${review.rating} out of 5`}>
                {stars(review.rating)}
              </span>
              <p>{review.text}</p>
              <div className="review-author">
                <span>
                  {review.author} · {review.city}
                </span>
                <span className="demo-badge">Demo</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
