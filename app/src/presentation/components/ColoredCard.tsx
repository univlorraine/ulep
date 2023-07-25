import styles from './ColoredCard.module.css';

interface ColoredCardProps<T> {
    buttonName: string;
    color: string;
    onPressed: (value: T) => void;
    title: string;
    value: T;
}

const ColoredCard = <T,>({ buttonName, color, onPressed, title, value }: ColoredCardProps<T>) => {
    return (
        <div key={title} className={styles['container']} style={{ backgroundColor: color }}>
            <span className={styles['title']}>{title}</span>
            <button className="primary-button" onClick={() => onPressed(value)}>
                {buttonName}
            </button>
        </div>
    );
};

export default ColoredCard;
