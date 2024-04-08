import { IonHeader } from '@ionic/react';
import { useHistory } from 'react-router';
import { LeftChevronSvg } from '../../assets';
import styles from './Header.module.css';
import ProgressBar from './ProgressBar';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    goBackPressed?: () => void;
    progressColor: string;
    progressPercentage: number;
    title: string;
    hasGoBackButton: boolean;
}

const Header: React.FC<HeaderProps> = ({
    goBackPressed,
    progressColor,
    progressPercentage,
    title,
    hasGoBackButton,
}) => {
    const history = useHistory();
    const { t } = useTranslation();
    return (
        <IonHeader>
            <ProgressBar color={progressColor} percentage={progressPercentage} />
            <div className={styles.container}>
                <div>
                    {hasGoBackButton && (
                        <button
                            aria-label={t('global.go_back') as string}
                            className={styles['image-div']}
                            onClick={() => (goBackPressed ? goBackPressed() : history.goBack())}
                        >
                            <img alt={t('global.go_back') as string} className={styles.image} src={LeftChevronSvg} />
                        </button>
                    )}
                </div>
                <h1 className={styles.title}>{title}</h1>
                <div />
            </div>
        </IonHeader>
    );
};

export default Header;
