import React, { useContext } from 'react';
import { FaCheck, FaFont, FaGlobeAsia, FaMoon, FaSun } from 'react-icons/fa';
import { languages, SettingsContext } from '../context/SettingsContext';

const SettingsPage = () => {
  const { theme, setTheme, language, setLanguage, fontScale, setFontScale, t } = useContext(SettingsContext);
  return <div className="container py-4 py-lg-5 settings-page">
    <div className="mb-4"><h1 className="mb-1">{t('Settings')}</h1><p className="text-muted mb-0">Personalize the way PlacementChecker looks and reads.</p></div>
    <div className="row g-4">
      <section className="col-12"><div className="glass-card p-4"><div className="d-flex gap-3"><FaGlobeAsia className="text-primary mt-1" size={24}/><div className="w-100"><h4>Language</h4><p className="text-muted">Choose the language used for navigation and supported interface text.</p><div className="row g-2">{languages.map((item) => <div className="col-sm-6 col-lg-4" key={item.code}><button onClick={() => setLanguage(item.code)} className={`language-option w-100 text-start ${language === item.code ? 'selected' : ''}`}><span><strong>{item.nativeName}</strong><small>{item.name}</small></span>{language === item.code && <FaCheck className="text-primary"/>}</button></div>)}</div></div></div></div></section>
      <section className="col-lg-6"><div className="glass-card p-4 h-100"><div className="d-flex gap-3"><FaFont className="text-primary mt-1" size={22}/><div className="w-100"><h4>Font size</h4><p className="text-muted">Adjust text size for comfortable reading.</p><div className="d-flex align-items-center gap-3"><span className="small">A</span><input className="form-range" type="range" min="85" max="120" step="5" value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))}/><span className="fs-4">A</span></div><div className="text-center text-muted small">{fontScale}%</div></div></div></div></section>
      <section className="col-lg-6"><div className="glass-card p-4 h-100"><h4>Theme</h4><p className="text-muted">Select the color appearance you prefer.</p><div className="d-flex gap-3"><button className={`theme-choice ${theme === 'light' ? 'selected' : ''}`} onClick={() => setTheme('light')}><FaSun className="text-warning"/> Light</button><button className={`theme-choice ${theme === 'dark' ? 'selected' : ''}`} onClick={() => setTheme('dark')}><FaMoon/> Dark</button></div></div></section>
    </div>
  </div>;
};
export default SettingsPage;
