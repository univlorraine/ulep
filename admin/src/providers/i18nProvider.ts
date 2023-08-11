import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
import { resolveBrowserLocale } from 'react-admin';
import customEN from '../locales/en.json';
import customFR from '../locales/fr.json';

const i18nProvider = polyglotI18nProvider(
    (locale) => {
        localStorage.setItem('locale', locale);

        return locale === 'fr' ? { ...fr, ...customFR } : { ...en, ...customEN };
    },
    resolveBrowserLocale(),
    [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }],
);

export default i18nProvider;
