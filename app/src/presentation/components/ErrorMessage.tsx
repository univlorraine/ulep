import { useTranslation } from 'react-i18next';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    description: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ description }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <img alt="error" className={styles.image} src="/assets/close.svg" />
            <div className={styles.title}>
                {t('global.error')} <br />
                <span className={styles.description}>{description}</span>
            </div>
        </div>
    );
};

export default ErrorMessage;
