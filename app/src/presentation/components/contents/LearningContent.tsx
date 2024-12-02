import { IonButton, IonIcon } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { AddSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
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

const TANDEM_COLORS = ['#E0897C', '#8BC4C4', '#B4C2DE'];

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
    setCurrentTandem: (tandem: Tandem) => void;
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
    setCurrentTandem,
    onShowAllGoalsPressed,
}) => {
    const { t } = useTranslation();
    const { deviceAdapter } = useConfig();
    const history = useHistory();
    const [currentTandemColor, setCurrentTandemColor] = useState<string>(TANDEM_COLORS[0]);

    const openAddLearningLanguagePressed = () => {
        history.push('pairing/languages');
    };

    const openUniversityInfos = () => {
        console.log('openUniversityInfos');
    };

    const handleSetCurrentTandem = (tandem: Tandem, index: number) => {
        setCurrentTandem(tandem);
        setCurrentTandemColor(TANDEM_COLORS[index]);
    };

    return (
        <div
            className={`${styles.content} content-wrapper`}
            style={{ backgroundColor: deviceAdapter.isNativePlatform() ? currentTandemColor : undefined }}
        >
            <h1 className={styles.title}>{`${t('learning.title')}`}</h1>
            <div className={styles.container}>
                {!deviceAdapter.isNativePlatform() && <div className={styles.separator} />}
                <div className={styles.learningLanguageContainer}>
                    {tandems.map((tandem, index) => {
                        return (
                            <IonButton
                                key={tandem.id}
                                fill="clear"
                                className={`${styles.learningLanguage} ${
                                    tandem.id === currentTandem?.id ? styles.selectedLearningLanguage : ''
                                }`}
                                onClick={() => handleSetCurrentTandem(tandem, index)}
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
                                <ActiveTandemCard
                                    tandem={currentTandem}
                                    onTandemPressed={() => onValidatedTandemPressed(currentTandem)}
                                    currentColor={currentTandemColor}
                                />
                            )}
                            {currentTandem && currentTandem.status === 'DRAFT' && (
                                <PendingTandemCard
                                    tandem={currentTandem}
                                    onTandemPressed={() => onTandemPressed(currentTandem)}
                                    currentColor={currentTandemColor}
                                />
                            )}
                            {currentTandem && currentTandem.learningLanguage.certificateOption && (
                                <>
                                    <LearningJournalCard tandem={currentTandem} />
                                    <LearningGoalCard
                                        profile={profile}
                                        customLearningGoals={currentTandem.learningLanguage?.customLearningGoals}
                                        onShowAllGoalsPressed={() => onShowAllGoalsPressed()}
                                    />
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
                                    currentColor={currentTandemColor}
                                />
                            )}
                            {currentTandem && (
                                <ProficiencyTestCard
                                    testedLanguages={learningLanguagesToTestedLanguages(
                                        profile.learningLanguages,
                                        profile.testedLanguages,
                                        currentTandem?.learningLanguage.code
                                    )}
                                    currentColor={currentTandemColor}
                                />
                            )}
                            <CreateLearningLanguageCard onPress={openAddLearningLanguagePressed} />
                        </Masonry>
                    </ResponsiveMasonry>
                )}
            </div>
        </div>
    );
};

export default LearningContent;
