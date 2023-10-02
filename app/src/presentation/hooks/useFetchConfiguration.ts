import { useEffect, useState } from 'react';

const useFetchConfiguration = (apiUrl: string) => {
    const [configuration, setConfiguration] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUrl = apiUrl || import.meta.env.VITE_API_URL;

        fetch(`${fetchUrl}/configuration`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors du chargement.');
                }
                return response.json();
            })
            .then((data) => {
                setConfiguration(data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [apiUrl]);

    return { configuration, error, loading };
};
