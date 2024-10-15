import { CheckSvg } from '../../assets';
import styles from './Checkbox.module.css';
interface CheckboxProps {
    isSelected: boolean;
    onPressed?: () => void;
    name?: JSX.Element | string | null;
    textClass?: string;
    ariaLabel?: string;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onPressed, name, textClass, ariaLabel, className }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onPressed && onPressed();
    };
    return (
        <div className={`${styles.container} ${className}`}>
            <button
                onClick={onPressed}
                style={{ backgroundColor: !isSelected ? 'white' : 'black' }}
                className={isSelected ? styles['checkbox-selected'] : styles['checkbox-unselected']}
                aria-label={ariaLabel ?? (name as string)}
                aria-checked={isSelected}
                role="checkbox"
            >
                {isSelected && <img alt="check" className={styles.image} src={CheckSvg} />}
            </button>
            {name && (
                <span className={textClass} onClick={handleClick}>
                    {name}
                </span>
            )}
        </div>
    );
};

export default Checkbox;
