import styles from './RadioButton.module.css';

interface RadioButtonProps {
    isSelected: boolean;
    onPressed: () => void;
    name: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ isSelected, onPressed, name }) => {
    return (
        <button className={styles.container} onClick={onPressed}>
            <div className={styles['outer-circle']}>
                <div
                    style={{ backgroundColor: !isSelected ? 'white' : 'black' }}
                    className={styles['inner-circle']}
                ></div>
            </div>
            <p className={styles.name}>{name}</p>
        </button>
    );
};

export default RadioButton;
