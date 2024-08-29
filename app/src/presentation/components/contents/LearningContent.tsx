import { IonButton, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { AddSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import ActiveTandemCard from '../tandems/ActiveTandemCard';
import PendingTandemCard from '../tandems/PendingTandemCard';
import styles from './LearningContent.module.css';

interface LearningContentProps {
    isLoading: boolean;
    profile: Profile;
    tandems: Tandem[];
    onTandemPressed: (tandem: Tandem) => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
}

const LearningContent: React.FC<LearningContentProps> = ({
    isLoading,
    profile,
    tandems,
    onTandemPressed,
    onValidatedTandemPressed,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [currentTandem, setCurrentTandem] = useState<Tandem>(tandems[0]);

    const openAddLearningLanguagePressed = () => {
        history.push('pairing/languages');
    };

    // WARNING: this useEffect is a workaround to avoid currentLearningLanguage being undefined sometimes
    useEffect(() => {
        setCurrentTandem(tandems[0]);
    }, [tandems]);

    return (
        <div className={`${styles.content} content-wrapper`}>
            <h1 className={styles.title}>{`${t('learning.title')}`}</h1>
            <div className={styles.separator} />
            <div className={styles.learningLanguageContainer}>
                {tandems.map((tandem) => {
                    return (
                        <IonButton
                            key={tandem.id}
                            fill="clear"
                            className={`${styles.learningLanguage} ${
                                tandem.id === currentTandem?.id ? styles.selectedLearningLanguage : ''
                            }`}
                            onClick={() => setCurrentTandem(tandem)}
                        >
                            <p>{t(`languages_code.${tandem.learningLanguage.code}`)}</p>
                        </IonButton>
                    );
                })}
                <IonButton
                    fill="clear"
                    className={styles.addLearningLanguageButton}
                    onClick={openAddLearningLanguagePressed}
                >
                    <IonIcon icon={AddSvg} />
                </IonButton>
            </div>

            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1024: 2 }}>
                <Masonry className={styles.masonery} gutter="20px">
                    {currentTandem && currentTandem.status === 'ACTIVE' && (
                        <ActiveTandemCard
                            tandem={currentTandem}
                            onTandemPressed={() => onValidatedTandemPressed(currentTandem)}
                        />
                    )}
                    {currentTandem && currentTandem.status !== 'ACTIVE' && (
                        <PendingTandemCard
                            tandem={currentTandem}
                            onTandemPressed={() => onTandemPressed(currentTandem)}
                        />
                    )}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};

export default LearningContent;
