import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';

interface useGetMediaObjectProps {
    id: string;
    refresh?: boolean;
}

const useGetMediaObject = ({ id, refresh }: useGetMediaObjectProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState<string>('');
    const [error, setError] = useState<string | undefined>();
    const { accessToken, getMediaObject } = useConfig();

    useEffect(() => {
        const getPresignedURL = async () => {
            setLoading(true);
            const result = await getMediaObject.execute(id, accessToken);

            if (result instanceof Error) {
                setLoading(false);
                setError(result.message);
                return;
            }

            setImage(result.url);
            setLoading(false);
        };

        getPresignedURL();
    }, [id, refresh]);

    return { loading, image, error };
};

export default useGetMediaObject;
