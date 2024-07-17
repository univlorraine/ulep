import { useTranslation } from 'react-i18next';
import { CloseSvg } from '../../assets';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    description: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ description }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <img alt="" className={styles.image} src={CloseSvg} aria-hidden={true} />
            <div className={styles.title}>
                {t('global.error')} <br />
                <span className={styles.description}>{description}</span>
            </div>
        </div>
    );
};

export default ErrorMessage;
