import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

export interface BackendOptions {
    loadPath: string;
}

i18n.use(HttpApi) // charge les traductions à partir des fichiers distants
    .use(initReactI18next) // initialise react-i18next
    .init({
        lng: 'fr', // langue par défaut
        fallbackLng: 'en', // si la langue choisie ne peut pas être chargée, utiliser l'anglais
        debug: import.meta.env.VITE_ENV === 'dev',
        backend: {
            loadPath: `/locales/{{lng}}/translation.json`,
        },

        interpolation: {
            escapeValue: false, // not needed for React as it escapes by default
        },
    });

export default i18n;
