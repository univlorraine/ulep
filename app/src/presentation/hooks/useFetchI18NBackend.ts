import { Device } from '@capacitor/device';
import { i18n } from 'i18next';
import { useEffect, useState } from 'react';
import initI18n from '../../i18n';
import { useStoreActions, useStoreState } from '../../store/storeTypes';

const useFetchI18NBackend = (apiUrl: string): i18n => {
    const language = useStoreState((state) => state.language);
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const [i18nInstance, setI18nInstance] = useState<i18n>(initI18n());
    useEffect(() => {
        const setDefaultLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();
            setLanguage({ language: deviceLanguage.value });
        };
        setDefaultLanguage();
    }, []);

    useEffect(() => {
        const getLanguage = async () => {
            if (import.meta.env.VITE_ENV !== 'dev') {
                setI18nInstance(initI18n(apiUrl, language));
            }
            document.documentElement.lang = language;
        };
        getLanguage();
    }, [apiUrl, language]);

    return i18nInstance;
};

export default useFetchI18NBackend;
