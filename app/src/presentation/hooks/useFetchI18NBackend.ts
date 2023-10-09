import { useEffect } from 'react';
import i18n, { BackendOptions } from '../../i18n';

const useFetchI18NBackend = (apiUrl: string) => {
    useEffect(() => {
        const configuredApiUrl = import.meta.env.VITE_API_URL || apiUrl;
        const newi18nPath = configuredApiUrl
            ? `${configuredApiUrl}/instance/locales/{{lng}}/translation`
            : '/locales/{{lng}}/translation.json';
        (i18n.options.backend as BackendOptions).loadPath = newi18nPath;
        i18n.reloadResources();
    }, [apiUrl]);
};

export default useFetchI18NBackend;
