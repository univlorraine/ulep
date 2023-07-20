import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { codeCountryToFlag } from '../utils';
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
    return (
        <button
            key={language.code}
            className={styles['language-container']}
            disabled={disabled}
            style={{
                backgroundColor: isSelected ? configuration.secondaryDarkColor : configuration.secondaryColor,
            }}
            onClick={() => (onPressed ? onPressed(language) : null)}
        >
            <span className={styles.flag}>{codeCountryToFlag(language.code.toLowerCase())}</span>
            <span className={styles.country} style={{ color: textColor }}>
                {language.name}
            </span>
        </button>
    );
};

export default FlagBubble;
