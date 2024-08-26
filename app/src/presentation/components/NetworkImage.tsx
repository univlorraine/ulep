import { IonSpinner } from '@ionic/react';
import useGetMediaObject from '../hooks/useGetMediaObject';

type NetworkImageProps = {
    id: string;
    placeholder?: string;
} & Omit<React.ComponentPropsWithRef<'img'>, 'src'>;

const NetworkImage: React.FC<NetworkImageProps> = ({ id, placeholder, ...props }) => {
    const { loading, image, error } = useGetMediaObject({ id });

    if (loading) {
        return <IonSpinner color={'primary'}></IonSpinner>;
    }

    return <img src={!image || error ? placeholder : image} {...props} />;
};

export default NetworkImage;
