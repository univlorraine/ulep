import useGetMediaObject from '../hooks/useGetMediaObject';
import style from './NetworkImage.module.css';
import { IonSpinner } from '@ionic/react';

interface NetworkImageProps {
    id: string;
    alt?: string;
    viewClassName?: string;
    placeholder?: string;
}

const NetworkImage: React.FC<NetworkImageProps> = ({ id, alt = 'image', viewClassName, placeholder }) => {
    const { loading, image, error } = useGetMediaObject({ id });

    return loading ? (
        <IonSpinner color={'primary'}></IonSpinner>
    ) : (
        <img alt={alt} src={error ? placeholder : image} className={style.image + ' ' + viewClassName} />
    );
};

export default NetworkImage;
