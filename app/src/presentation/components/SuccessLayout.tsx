import { IonPage } from '@ionic/react';
import { ReactElement } from 'react';
import { ReactComponent as Background } from '../../../public/assets/background.svg';
import styles from './SuccessLayout.module.css';

interface SuccessLayoutProps {
    backgroundColorCode: string;
    backgroundIconColor: string;
    children: ReactElement;
    colorCode: string;
}

const SuccessLayout: React.FC<SuccessLayoutProps> = ({
    backgroundIconColor,
    backgroundColorCode,
    children,
    colorCode,
}) => {
    return (
        <IonPage>
            <div className={styles['web-content']} style={{ backgroundColor: backgroundColorCode }}>
                <div className={styles['main-content']} style={{ backgroundColor: colorCode }}>
                    <Background className={styles.image} style={{ color: backgroundIconColor }} />
                    <div className={styles['children-content']}>{children}</div>
                </div>
            </div>
        </IonPage>
    );
};

export default SuccessLayout;
