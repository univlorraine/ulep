import { IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import { codeLanguageToFlag } from '../../utils';
import Avatar from '../Avatar';
import styles from './TandemCardButton.module.css';

interface TandemCardButtonProps {
    tandem: Tandem;
    onClick: () => void;
}

const TandemCardButton: React.FC<TandemCardButtonProps> = ({ tandem, onClick }) => {
    const { t } = useTranslation();

    return (
        <button className={styles.container} onClick={onClick}>
            <div className={styles['avatar-container']}>
                <Avatar className={styles.avatar} user={tandem.partner?.user} />
                <div className={styles['flag-container']}>
                    <span className={styles.flag} role="img" aria-label={tandem.learningLanguage.name}>
                        {codeLanguageToFlag(tandem.learningLanguage.code)}
                    </span>
                </div>
            </div>
            <div className={styles.informationsContainer}>
                <p className={styles.name}>
                    {tandem.partner?.user.firstname} {tandem.partner?.user.lastname}
                    <IonIcon icon={chevronForward} color="dark" className={styles.icon} />
                </p>
                <p className={styles.informations}>
                    {tandem.partner?.user.age} {t('global.years_old')}
                </p>
                <p className={styles.informations}>{tandem.partner?.user.university?.name}</p>
            </div>
        </button>
    );
};

export default TandemCardButton;
