export const languages = {
  no: 'Norsk',
  en: 'English'
} as const;

export type Language = keyof typeof languages;

export const defaultLanguage: Language = 'no';

// Get the current language from URL or localStorage
export function getCurrentLanguage(): Language {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // First check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    if (langParam && langParam in languages) {
      return langParam;
    }
    
    // Then check localStorage
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && storedLang in languages) {
      return storedLang;
    }
  }
  
  return defaultLanguage;
}

// Get language at build time from URL (for Astro SSG)
export function getBuildTimeLanguage(url?: URL): Language {
  if (url) {
    const langParam = url.searchParams.get('lang') as Language;
    if (langParam && langParam in languages) {
      return langParam;
    }
  }
  return defaultLanguage;
}

// Set the current language in localStorage and URL
export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  }
}

// Helper function to get translation based on current language
export function t(translations: Record<Language, string>, fallbackLang: Language = defaultLanguage): string {
  const currentLang = getCurrentLanguage();
  return translations[currentLang] || translations[fallbackLang] || Object.values(translations)[0];
}

// Helper function to get nested translations
export function getTranslations(lang?: Language) {
  const currentLang = lang || getCurrentLanguage();
  
  // Dynamic import based on language
  switch (currentLang) {
    case 'en':
      return import('../locales/en.json');
    case 'no':
    default:
      return import('../locales/no.json');
  }
}

// Simple translation function for when you have the translations object
export function translate(key: string, translations: any, lang?: Language): string {
  const currentLang = lang || getCurrentLanguage();
  
  // Support nested keys like "dialog.title"
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      break;
    }
  }
  
  // Fallback to default language if translation not found
  if (!value && currentLang !== defaultLanguage) {
    value = translations[defaultLanguage];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
  }
  
  return value || key;
}
