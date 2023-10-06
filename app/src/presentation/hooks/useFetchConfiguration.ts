import { useEffect, useState } from 'react';
import Configuration from '../../domain/entities/Confirguration';
import { useTranslation } from 'react-i18next';

interface InstanceCommand {
    name: string;
    email: string;
    cguUrl: string;
    confidentialityUrl: string;
    ressourceUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
}

const useFetchConfiguration = (apiUrl: string) => {
    const { t } = useTranslation();
    const [configuration, setConfiguration] = useState<Configuration>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(true);

    const askInstance = async () => {
        try {
            const response = await fetch(`${apiUrl}/instance/config`);

            if (!response.ok) {
                const message = t('instance.error');
                throw new Error(message);
            }

            const result: InstanceCommand = await response.json();
            setConfiguration(
                new Configuration(
                    result.name,
                    result.name,
                    result.email,
                    result.cguUrl,
                    result.confidentialityUrl,
                    result.ressourceUrl,
                    result.primaryColor,
                    result.primaryDarkColor,
                    result.primaryBackgroundColor,
                    result.secondaryColor,
                    result.secondaryDarkColor,
                    result.secondaryBackgroundColor
                )
            );
            document.documentElement.style.setProperty('--primary-color', result.primaryColor);
            document.documentElement.style.setProperty('--primary-dark-color', result.primaryDarkColor);
            document.documentElement.style.setProperty('--secondary-color', result.secondaryColor);
            document.documentElement.style.setProperty('--secondary-dark-color', result.secondaryDarkColor);
        } catch (error: any) {
            setError(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        askInstance();
        setLoading(false);
    }, [apiUrl]);

    return { configuration, error, loading };
};

export default useFetchConfiguration;
