import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          <Link to="/" className="site-footer-logo">VIN<span>T</span>IQUE</Link>
          <div className="site-footer-tag">Pre-loved. Reworn. Rewired.</div>
        </div>
        <div className="site-footer-contact-group">
          <a href="tel:+966501176376" className="site-footer-contact">+966 50 117 6376</a>
          <a href="mailto:srtmusab@gmail.com" className="site-footer-contact">srtmusab@gmail.com</a>
        </div>
      </div>
      <div className="site-footer-copy">© 2025 Vintique. All rights reserved.</div>
    </footer>
  );
}
