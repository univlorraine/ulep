import { Device } from '@capacitor/device';
import { i18n } from 'i18next';
import { useEffect, useState } from 'react';
import initI18n from '../../i18n';
import { useStoreActions, useStoreState } from '../../store/storeTypes';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

const useFetchI18NBackend = (apiUrl: string): i18n => {
    const isRtl = useStoreState((state) => state.isRtl);
    const language = useStoreState((state) => state.language);
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const setRtl = useStoreActions((state) => state.setRtl);
    const [i18nInstance, setI18nInstance] = useState<i18n>(initI18n());
    useEffect(() => {
        const setDefaultLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();

            setLanguage({ language: deviceLanguage.value });
            // if isRtl is true, user forced it on settings, else its undefined
            setRtl({ isRtl: isRtl === true || RTL_LANGUAGES.includes(deviceLanguage.value) });
        };
        setDefaultLanguage();
    }, []);

    useEffect(() => {
        const getLanguage = async () => {
            if (import.meta.env.VITE_ENV !== 'dev') {
                setI18nInstance(initI18n(apiUrl, language));
            }
            document.documentElement.lang = language;

            if (isRtl) {
                document.documentElement.dir = 'rtl';
            } else {
                document.documentElement.dir = 'ltr';
            }
        };
        getLanguage();
    }, [apiUrl, language, isRtl]);

    return i18nInstance;
};

export default useFetchI18NBackend;
