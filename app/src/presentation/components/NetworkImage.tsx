import { IonSpinner } from '@ionic/react';
import { useEffect } from 'react';
import useGetMediaObject from '../hooks/useGetMediaObject';

type NetworkImageProps = {
    id: string;
    placeholder?: string;
    onErrorComponent?: () => JSX.Element;
    isRefresh?: boolean;
    setRefresh?: (refresh: boolean) => void;
} & Omit<React.ComponentPropsWithRef<'img'>, 'src'>;

const NetworkImage: React.FC<NetworkImageProps> = ({
    id,
    placeholder,
    onErrorComponent,
    isRefresh,
    setRefresh,
    ...props
}) => {
    const { loading, image, error } = useGetMediaObject({ id, refresh: isRefresh });

    useEffect(() => {
        !loading && setRefresh && setRefresh(false);
    }, [loading]);

    if (loading) {
        return <IonSpinner color={'primary'}></IonSpinner>;
    }

    if ((error || !image) && onErrorComponent) {
        return onErrorComponent();
    }

    return <img src={!image || error ? placeholder : image} {...props} />;
};

export default NetworkImage;
