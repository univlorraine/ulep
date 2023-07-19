import styles from './Checkbox.module.css';
interface CheckboxProps {
    isSelected: boolean;
    onPressed: () => void;
    name: string | null;
    textClass?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onPressed, name, textClass }) => {
    return (
        <div className={styles.container} onClick={onPressed}>
            <div
                style={{ backgroundColor: !isSelected ? 'white' : 'black' }}
                className={isSelected ? styles['checkbox-selected'] : styles['checkbox-unselected']}
            >
                {isSelected && <img alt="check" className={styles.image} src="/assets/check.svg" />}
            </div>
            <span className={textClass}>{name}</span>
        </div>
    );
};

export default Checkbox;
