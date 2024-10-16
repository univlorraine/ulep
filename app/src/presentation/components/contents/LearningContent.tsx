import { IonButton, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { AddSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import { learningLanguagesToTestedLanguages } from '../../utils';
import CreateLearningLanguageCard from '../card/CreateLearningLanguageCard';
import PartnerUniversityCard from '../card/PartnerUniversityCard';
import ProficiencyTestCard from '../card/ProficiencyTestCard';
import RessourcesCard from '../card/RessourcesCard';
import Loader from '../Loader';
import ActiveTandemCard from '../tandems/ActiveTandemCard';
import PendingTandemCard from '../tandems/PendingTandemCard';
import styles from './LearningContent.module.css';
import LearningJournalCard from '../tandems/LearningJournalCard';
import LearningGoalCard from '../tandems/LearningGoalCard';

interface LearningContentProps {
    isLoading: boolean;
    profile: Profile;
    tandems: Tandem[];
    onTandemPressed: (tandem: Tandem) => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
    onVocabularyListPressed: () => void;
    onActivitiesContentPressed: () => void;
    onShowAllGoalsPressed: () => void;
}

const LearningContent: React.FC<LearningContentProps> = ({
    isLoading,
    profile,
    tandems,
    onTandemPressed,
    onValidatedTandemPressed,
    onVocabularyListPressed,
    onActivitiesContentPressed,
    onShowAllGoalsPressed,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [currentTandem, setCurrentTandem] = useState<Tandem>(tandems[0]);

    const openAddLearningLanguagePressed = () => {
        history.push('pairing/languages');
    };

    const openUniversityInfos = () => {
        console.log('openUniversityInfos');
    };

    // WARNING: this useEffect is a workaround to avoid currentLearningLanguage being undefined sometimes
    useEffect(() => {
        if (tandems.length > 0) {
            setCurrentTandem(tandems[0]);
        }
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
                    aria-label={t('learning.add_language') as string}
                >
                    <IonIcon icon={AddSvg} aria-hidden="true" />
                </IonButton>
            </div>

            {isLoading ? (
                <div className={styles.loaderContainer}>
                    <Loader />
                </div>
            ) : (
                <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1024: 2 }}>
                    <Masonry className={styles.masonery} gutter="20px">
                        {currentTandem && currentTandem.status === 'ACTIVE' && (
                            <>
                                <ActiveTandemCard
                                    tandem={currentTandem}
                                    onTandemPressed={() => onValidatedTandemPressed(currentTandem)}
                                />
                                <PendingTandemCard
                                    tandem={currentTandem}
                                    onTandemPressed={() => onTandemPressed(currentTandem)}
                                />
                                {currentTandem.learningLanguage.certificateOption && (
                                    <>
                                        <LearningJournalCard
                                            tandem={currentTandem}
                                            onTandemPressed={() => onValidatedTandemPressed(currentTandem)}
                                        />
                                        <LearningGoalCard
                                            profile={profile}
                                            onShowAllGoalsPressed={() => onShowAllGoalsPressed()}
                                        />
                                    </>
                                )}
                            </>
                        )}
                        <RessourcesCard
                            onLearningJournalPressed={() => console.log('onLearningJournalPressed')}
                            onVocabularyPressed={onVocabularyListPressed}
                            onActivityPressed={onActivitiesContentPressed}
                            onGamePressed={() => console.log('onGamePressed')}
                        />
                        {currentTandem && currentTandem.partner?.user.university && (
                            <PartnerUniversityCard
                                university={currentTandem.partner?.user.university}
                                onPress={openUniversityInfos}
                            />
                        )}
                        {currentTandem && (
                            <ProficiencyTestCard
                                testedLanguages={learningLanguagesToTestedLanguages(
                                    profile.learningLanguages,
                                profile.testedLanguages,
                                currentTandem?.learningLanguage.code
                                )}
                            />
                        )}
                        <CreateLearningLanguageCard onPress={openAddLearningLanguagePressed} />
                    </Masonry>
                </ResponsiveMasonry>
            )}
        </div>
    );
};

export default LearningContent;
