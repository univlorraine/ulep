import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
import { resolveBrowserLocale } from 'react-admin';

const i18nProvider = polyglotI18nProvider(
    (locale) => (locale === 'fr' ? fr : en),
    resolveBrowserLocale(),
    [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }],
);

export default i18nProvider;
