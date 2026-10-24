export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-note">
          <strong>WellTogether</strong>
          <p>
            A third-party wellness marketplace for discovering and enquiring with
            centres across India. We do not provide medical advice.
          </p>
        </div>
        <div className="footer-note">
          <p>
            Demo preview: centre listings, ratings and reviews shown here are sample
            data for design review.
          </p>
          <p>© {new Date().getFullYear()} WellTogether</p>
        </div>
      </div>
    </footer>
  );
}
