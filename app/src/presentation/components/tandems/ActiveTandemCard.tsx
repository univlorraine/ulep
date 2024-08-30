import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import { codeLanguageToFlag } from '../../utils';
import Avatar from '../Avatar';
import styles from './ActiveTandemCard.module.css';

interface ActiveTandemCardProps {
    tandem: Tandem;
    onTandemPressed: () => void;
}

const ActiveTandemCard: React.FC<ActiveTandemCardProps> = ({ tandem, onTandemPressed }) => {
    const { t } = useTranslation();
    const language = tandem.partnerLearningLanguage;
    return (
        <div className="home-card">
            <p className="home-card-title">{t('learning.card.my_tandem')}</p>
            <button className={styles.container} onClick={onTandemPressed}>
                <div className={styles['avatar-container']}>
                    <Avatar className={styles.avatar} user={tandem.partner?.user} />
                    <div className={styles['flag-container']}>
                        <span className={styles.flag} role="img" aria-label={language.name}>
                            {codeLanguageToFlag(language.code)}
                        </span>
                    </div>
                </div>
                <div>
                    <p className={styles.name}>
                        {tandem.partner?.user.firstname} {tandem.partner?.user.lastname}
                    </p>
                    <p className={styles.informations}>
                        {tandem.partner?.user.age} {t('global.years_old')}
                    </p>
                    <p className={styles.informations}>{tandem.partner?.user.university?.name}</p>
                </div>
            </button>
        </div>
    );
};

export default ActiveTandemCard;
