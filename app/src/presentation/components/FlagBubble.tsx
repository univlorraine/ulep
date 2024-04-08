import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { codeLanguageToFlag } from '../utils';
import styles from './FlagBubble.module.css';

interface FlagBubbleProps {
    disabled?: boolean;
    language: Language;
    isSelected: boolean;
    onPressed?: (language: Language) => void;
    textColor?: string;
}

const FlagBubble: React.FC<FlagBubbleProps> = ({ disabled, isSelected, language, onPressed, textColor = 'black' }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    return (
        <button
            key={language.code}
            className={styles['language-container']}
            disabled={disabled}
            style={{
                backgroundColor: isSelected ? configuration.secondaryDarkColor : configuration.secondaryColor,
            }}
            onClick={() => (onPressed ? onPressed(language) : null)}
            aria-label={t(`languages_code.${language.code}`) as string}
        >
            <span className={styles.flag}>{codeLanguageToFlag(language.code)}</span>
            <span className={styles.country} style={{ color: textColor }}>
                {t(`languages_code.${language.code}`)}
            </span>
        </button>
    );
};

export default FlagBubble;
