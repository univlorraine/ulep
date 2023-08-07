import { IonHeader } from '@ionic/react';
import { useHistory } from 'react-router';
import { LeftChevronSvg } from '../../assets';
import styles from './Header.module.css';
import ProgressBar from './ProgressBar';

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
                    <img alt="goBack" className={styles.image} src={LeftChevronSvg} />
                </button>
                <h1 className={styles.title}>{title}</h1>
                <div />
            </div>
        </IonHeader>
    );
};

export default Header;
