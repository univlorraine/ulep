import { useTranslation } from 'react-i18next';
import { codeLanguageToFlag } from '../utils';
import styles from './LanguageTag.module.css';

interface LanguageTagProps {
    languageCode: string;
}

const LanguageTag: React.FC<LanguageTagProps> = ({ languageCode }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <span
                className={styles.text}
            >{`${t(`languages_code.${languageCode}`)} ${codeLanguageToFlag(languageCode)}`}</span>
        </div>
    );
};

export default LanguageTag;
