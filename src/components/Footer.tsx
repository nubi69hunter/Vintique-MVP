import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-left">
          <Link to="/" className="site-footer-logo">VIN<span>T</span>IQUE</Link>
          <div className="site-footer-tag">{t('footer.tagline')}</div>
        </div>
        <div className="site-footer-contact-group">
          <a href="tel:+966501176376" className="site-footer-contact"><span dir="ltr">+966 50 117 6376</span></a>
          <a href="mailto:srtmusab@gmail.com" className="site-footer-contact">srtmusab@gmail.com</a>
        </div>
      </div>
      <div className="site-footer-copy">{t('footer.copyright')}</div>
    </footer>
  );
}
