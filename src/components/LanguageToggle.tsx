import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      className="nav-icon-btn lang-toggle"
      onClick={toggle}
      aria-label="Toggle language"
      style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', minWidth: '2.8rem' }}
    >
      {isAr ? 'EN' : 'AR'}
    </button>
  );
}
