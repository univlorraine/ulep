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
        const checkApiHealthAndSetLanguage = async () => {
            try {
                const response = await fetch(`${apiUrl}/health`);
                if (response.ok) {
                    setI18nInstance(initI18n(apiUrl, language));
                } else {
                    throw new Error('API health check failed');
                }
            } catch (error) {
                console.error('API is not reachable, using local translations', error);
                setI18nInstance(initI18n(undefined, language));
            }

            document.documentElement.lang = language;
            document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        };

        checkApiHealthAndSetLanguage();
    }, [apiUrl, language, isRtl]);

    return i18nInstance;
};

export default useFetchI18NBackend;
