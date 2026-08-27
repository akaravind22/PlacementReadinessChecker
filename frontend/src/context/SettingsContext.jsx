import React, { createContext, useEffect, useMemo, useState } from 'react';

export const SettingsContext = createContext();

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

const translations = {
  en: {},
  ta: { Dashboard: 'டாஷ்போர்டு', Settings: 'அமைப்புகள்', Home: 'முகப்பு', About: 'எங்களைப் பற்றி', Contact: 'தொடர்பு', Login: 'உள்நுழை', Register: 'பதிவு செய்', Logout: 'வெளியேறு', 'My Profile': 'என் சுயவிவரம்', 'Technical Skills': 'தொழில்நுட்ப திறன்கள்', Projects: 'திட்டங்கள்', Certifications: 'சான்றிதழ்கள்', Internships: 'பயிற்சிகள்', 'Practice Quizzes': 'பயிற்சி வினாடி வினாக்கள்', 'Placement Drives': 'வேலைவாய்ப்பு முகாம்கள்', 'Placement Report': 'வேலைவாய்ப்பு அறிக்கை', 'Study Resources': 'கற்றல் வளங்கள்', Notifications: 'அறிவிப்புகள்', 'Admin Dashboard': 'நிர்வாக டாஷ்போர்டு', 'Manage Users': 'பயனர்களை நிர்வகி', 'Manage Quizzes': 'வினாடி வினாக்களை நிர்வகி', 'Manage Drives': 'முகாம்களை நிர்வகி', 'Manage Resources': 'வளங்களை நிர்வகி', 'System Reports': 'அமைப்பு அறிக்கைகள்', 'Officer Dashboard': 'அலுவலர் டாஷ்போர்டு', 'Student Directory': 'மாணவர் பட்டியல்', 'Post Placement Drive': 'வேலைவாய்ப்பு முகாமை இடு', 'Upload Resource': 'வளத்தைப் பதிவேற்று', 'Reports & Analytics': 'அறிக்கைகள் மற்றும் பகுப்பாய்வு', Save: 'சேமி', Cancel: 'ரத்துசெய்', Submit: 'சமர்ப்பி', Search: 'தேடு', Delete: 'நீக்கு', Edit: 'திருத்து', Loading: 'ஏற்றுகிறது...' },
  hi: { Dashboard: 'डैशबोर्ड', Settings: 'सेटिंग्स', Home: 'होम', About: 'हमारे बारे में', Contact: 'संपर्क', Login: 'लॉग इन', Register: 'रजिस्टर', Logout: 'लॉग आउट', 'My Profile': 'मेरी प्रोफ़ाइल', 'Technical Skills': 'तकनीकी कौशल', Projects: 'प्रोजेक्ट्स', Certifications: 'प्रमाणपत्र', Internships: 'इंटर्नशिप', 'Practice Quizzes': 'अभ्यास क्विज़', 'Placement Drives': 'प्लेसमेंट ड्राइव', 'Placement Report': 'प्लेसमेंट रिपोर्ट', 'Study Resources': 'अध्ययन संसाधन', Notifications: 'सूचनाएँ', 'Admin Dashboard': 'एडमिन डैशबोर्ड', 'Manage Users': 'उपयोगकर्ता प्रबंधित करें', 'Manage Quizzes': 'क्विज़ प्रबंधित करें', 'Manage Drives': 'ड्राइव प्रबंधित करें', 'Manage Resources': 'संसाधन प्रबंधित करें', 'System Reports': 'सिस्टम रिपोर्ट', 'Officer Dashboard': 'अधिकारी डैशबोर्ड', 'Student Directory': 'छात्र निर्देशिका', 'Post Placement Drive': 'प्लेसमेंट ड्राइव पोस्ट करें', 'Upload Resource': 'संसाधन अपलोड करें', 'Reports & Analytics': 'रिपोर्ट और विश्लेषण', Save: 'सहेजें', Cancel: 'रद्द करें', Submit: 'जमा करें', Search: 'खोजें', Delete: 'हटाएँ', Edit: 'संपादित करें', Loading: 'लोड हो रहा है...' },
};

const landingTranslations = {
  ta: {
    'Campus Recruitment Portal': 'வளாக வேலைவாய்ப்பு தளம்',
    'Assess & Accelerate Your': 'உங்கள் திறனை மதிப்பிட்டு மேம்படுத்துங்கள்',
    'Placement Readiness Score': 'வேலைவாய்ப்பு தயார்நிலை மதிப்பெண்',
    'Empower your college career with data-driven insights. Calculate your real-time Placement Readiness Index based on academics, coding skills, projects, certifications, internships, and technical quizzes.': 'தரவு சார்ந்த நுண்ணறிவுகளுடன் உங்கள் கல்லூரி வாழ்க்கையை மேம்படுத்துங்கள். கல்வி, நிரலாக்கத் திறன்கள், திட்டங்கள், சான்றிதழ்கள், பயிற்சிகள் மற்றும் தொழில்நுட்ப வினாடி வினாக்களின் அடிப்படையில் உங்கள் வேலைவாய்ப்பு தயார்நிலை குறியீட்டைக் கணக்கிடுங்கள்.',
    'Get Started': 'தொடங்குங்கள்', 'Sign In to Portal': 'தளத்தில் உள்நுழைக', 'Platform Capabilities': 'தளத்தின் அம்சங்கள்',
    'Designed for Students, Placement Officers, and Campus Administrators': 'மாணவர்கள், வேலைவாய்ப்பு அலுவலர்கள் மற்றும் வளாக நிர்வாகிகளுக்காக வடிவமைக்கப்பட்டது',
    'Smart Score Engine': 'சிறந்த மதிப்பெண் இயந்திரம்', 'Personalized Feedback': 'தனிப்பயன் கருத்து', 'Drives & Learning Portal': 'வேலைவாய்ப்பு மற்றும் கற்றல் தளம்',
  },
  hi: {
    'Campus Recruitment Portal': 'कैंपस भर्ती पोर्टल', 'Assess & Accelerate Your': 'अपनी प्रगति का आकलन और तेजी से विकास करें',
    'Placement Readiness Score': 'प्लेसमेंट तैयारी स्कोर',
    'Empower your college career with data-driven insights. Calculate your real-time Placement Readiness Index based on academics, coding skills, projects, certifications, internships, and technical quizzes.': 'डेटा-आधारित जानकारी के साथ अपने कॉलेज करियर को सशक्त बनाएं। शैक्षणिक प्रदर्शन, कोडिंग कौशल, प्रोजेक्ट, प्रमाणपत्र, इंटर्नशिप और तकनीकी क्विज़ के आधार पर अपना रियल-टाइम प्लेसमेंट तैयारी सूचकांक जानें।',
    'Get Started': 'शुरू करें', 'Sign In to Portal': 'पोर्टल में साइन इन करें', 'Platform Capabilities': 'प्लेटफ़ॉर्म क्षमताएँ',
    'Designed for Students, Placement Officers, and Campus Administrators': 'छात्रों, प्लेसमेंट अधिकारियों और कैंपस प्रशासकों के लिए बनाया गया',
    'Smart Score Engine': 'स्मार्ट स्कोर इंजन', 'Personalized Feedback': 'व्यक्तिगत सुझाव', 'Drives & Learning Portal': 'ड्राइव और लर्निंग पोर्टल',
  },
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem('fontScale')) || 100);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.style.setProperty('--user-font-scale', `${fontScale / 100}`);
    localStorage.setItem('fontScale', String(fontScale));
  }, [fontScale]);

  const value = useMemo(() => ({
    theme, setTheme, toggleTheme: () => setTheme((value) => value === 'dark' ? 'light' : 'dark'),
    language, setLanguage, fontScale, setFontScale,
    t: (text) => landingTranslations[language]?.[text] || translations[language]?.[text] || text,
  }), [theme, language, fontScale]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
