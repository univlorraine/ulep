import styles from './ProgressBar.module.css';


interface ProgressBarProps {
    color: string;
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ color, percentage }) => (
    <div className={styles['main-bar']} >
        <div className={styles['color-bar']} style={{ backgroundColor: color, width: `${percentage}%`}} />
    </div>
)

export default ProgressBar;
