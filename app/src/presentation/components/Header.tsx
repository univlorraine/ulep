import { IonBackButton, IonHeader } from '@ionic/react';
import ProgressBar from './ProgressBar';
import { useHistory } from 'react-router';
import styles from './Header.module.css';

interface HeaderProps {
    progressColor: string;
    progressPercentage: number;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ progressColor, progressPercentage, title }) => {
    const history = useHistory();
    return (
        <IonHeader>
            <ProgressBar color={progressColor} percentage={progressPercentage} />
            <div className={styles.container}>
                <button className={styles['image-div']} onClick={() => history.goBack()}>
                    <img alt="goBack" className={styles.image} src="/assets/left-chevron.svg" />
                </button>
                <h1 className={styles.title}>{title}</h1>
                <div />
            </div>
        </IonHeader>
    );
};

export default Header;
