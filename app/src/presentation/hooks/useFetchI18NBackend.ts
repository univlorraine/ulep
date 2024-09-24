import { Device } from '@capacitor/device';
import { i18n } from 'i18next';
import { useEffect, useState } from 'react';
import initI18n from '../../i18n';
import { useStoreState } from '../../store/storeTypes';

const useFetchI18NBackend = (apiUrl: string): i18n => {
    const language = useStoreState((state) => state.language);
    const [i18nInstance, setI18nInstance] = useState<i18n>(initI18n());
    useEffect(() => {
        const getLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();
            const userLanguage = language || deviceLanguage.value;
            if (import.meta.env.VITE_ENV === 'dev') {
                setI18nInstance(initI18n());
            } else {
                setI18nInstance(initI18n(apiUrl, userLanguage));
            }
            document.documentElement.lang = userLanguage;
        };
        getLanguage();
    }, [apiUrl, language]);

    return i18nInstance;
};

export default useFetchI18NBackend;
