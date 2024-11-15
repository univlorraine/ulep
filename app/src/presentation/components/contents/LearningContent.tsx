import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { AddSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreActions } from '../../../store/storeTypes';
import { learningLanguagesToTestedLanguages } from '../../utils';
import CreateLearningLanguageCard from '../card/CreateLearningLanguageCard';
import PartnerUniversityCard from '../card/PartnerUniversityCard';
import ProficiencyTestCard from '../card/ProficiencyTestCard';
import RessourcesCard from '../card/RessourcesCard';
import Loader from '../Loader';
import ActiveTandemCard from '../tandems/ActiveTandemCard';
import LearningGoalCard from '../tandems/LearningGoalCard';
import LearningJournalCard from '../tandems/LearningJournalCard';
import PendingTandemCard from '../tandems/PendingTandemCard';
import styles from './LearningContent.module.css';

interface LearningContentProps {
    isLoading: boolean;
    profile: Profile;
    tandems: Tandem[];
    currentTandem?: Tandem;
    onTandemPressed: (tandem: Tandem) => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
    onVocabularyListPressed: () => void;
    onActivitiesContentPressed: () => void;
    onShowAllGoalsPressed: () => void;
    onLearningBookContentPressed: () => void;
}

const LearningContent: React.FC<LearningContentProps> = ({
    isLoading,
    profile,
    tandems,
    currentTandem,
    onTandemPressed,
    onValidatedTandemPressed,
    onVocabularyListPressed,
    onActivitiesContentPressed,
    onShowAllGoalsPressed,
    onLearningBookContentPressed,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const setCurrentTandem = useStoreActions((actions) => actions.setCurrentTandem);

    const openAddLearningLanguagePressed = () => {
        history.push('pairing/languages');
    };

    const openUniversityInfos = () => {
        console.log('openUniversityInfos');
    };

    if (!currentTandem) {
        return <Loader />;
    }

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
                                tandem.id === currentTandem.id ? styles.selectedLearningLanguage : ''
                            }`}
                            onClick={() => setCurrentTandem({ tandem })}
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
                        {currentTandem.status === 'ACTIVE' && (
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
                                        <LearningJournalCard tandem={currentTandem} />
                                        <LearningGoalCard
                                            profile={profile}
                                            customLearningGoals={currentTandem.learningLanguage?.customLearningGoals}
                                            onShowAllGoalsPressed={() => onShowAllGoalsPressed()}
                                        />
                                    </>
                                )}
                            </>
                        )}
                        <RessourcesCard
                            onLearningBookPressed={onLearningBookContentPressed}
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
