import { CheckSvg } from '../../assets';
import styles from './Checkbox.module.css';
interface CheckboxProps {
    isSelected: boolean;
    onPressed: () => void;
    name: JSX.Element | string | null;
    textClass?: string;
    ariaLabel?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onPressed, name, textClass, ariaLabel }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onPressed();
    };
    return (
        <div className={styles.container}>
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
            <span className={textClass} onClick={handleClick}>
                {name}
            </span>
        </div>
    );
};

export default Checkbox;
