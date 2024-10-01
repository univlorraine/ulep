import i18next, { i18n } from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';

const DEFAULT_LANGUAGE = 'fr';
const DEFAULT_LOAD_PATH = '/locales/{{lng}}/translation.json';

export const initI18n = (apiUrl?: string, language?: string): i18n => {
    const i18n = i18next.createInstance();
    i18n.use(HttpBackend) // charge les traductions à partir des fichiers distants
        .init<HttpBackendOptions>({
            lng: language || DEFAULT_LANGUAGE,
            fallbackLng: 'en', // si la langue choisie ne peut pas être chargée, utiliser l'anglais
            debug: import.meta.env.VITE_ENV === 'dev',
            backend: {
                loadPath: apiUrl ? `${apiUrl}/instance/locales/{{lng}}/translation` : DEFAULT_LOAD_PATH,
            },
            interpolation: {
                escapeValue: false, // not needed for React as it escapes by default
            },
        });
    return i18n;
};

export default initI18n;
