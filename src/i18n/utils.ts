import pt from './pt.json';
import en from './en.json';

const translations = { pt, en } as const;

type Locale = keyof typeof translations;
type TranslationKey = keyof typeof pt;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return 'pt';
}

export function useTranslations(lang: Locale) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations['pt'][key] ?? key;
  };
}
