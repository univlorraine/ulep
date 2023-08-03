import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import TandemBubble from './TandemBubble';
import styles from './TandemList.module.css';

interface TandemListProps {
    studentId: string;
    tandems: Tandem[];
}

const TandemList: React.FC<TandemListProps> = ({ studentId, tandems }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.tandem.title')}</span>
            <div className={styles.container}>
                <div className={styles['tandem-container']}>
                    {tandems
                        .filter((tandem) => tandem.status === 'ACTIVE')
                        .map((tandem) => {
                            return (
                                <TandemBubble
                                    key={tandem.id}
                                    language={tandem.language}
                                    profileAvatar={
                                        tandem.profiles.find((profileTandem) => profileTandem.id !== studentId)?.avatar
                                    }
                                    profileName={
                                        tandem.profiles.find((profileTandem) => profileTandem.id !== studentId)
                                            ?.firstname
                                    }
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default TandemList;
