/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonButton, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useHistory } from 'react-router';
import { AddSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreActions } from '../../../store/storeTypes';
import { learningLanguagesToTestedLanguages } from '../../utils';
import CreateLearningLanguageCard from '../card/CreateLearningLanguageCard';
import PartnerUniversityCard from '../card/PartnerUniversityCard';
import ProficiencyTestCard from '../card/ProficiencyTestCard';
import RessourcesCard from '../card/RessourcesCard';
import Loader from '../Loader';
import EditoContentModal from '../modals/EditoContentModal';
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
    onShowAllGoalsPressed: (customLearningGoals?: CustomLearningGoal[]) => void;
    onLearningBookContentPressed: () => void;
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
    onLearningBookContentPressed,
}) => {
    const { t } = useTranslation();
    const { deviceAdapter } = useConfig();
    const history = useHistory();
    const setCurrentLearningWorkspace = useStoreActions((state) => state.setCurrentLearningWorkspace);
    const [currentTandemColor, setCurrentTandemColor] = useState<string>(
        TANDEM_COLORS[tandems.findIndex((tandem) => tandem.id === currentTandem?.id) || 0]
    );
    const [universityId, setUniversityId] = useState<string>();
    const openAddLearningLanguagePressed = () => {
        history.push('pairing/languages');
    };

    const openUniversityInfos = (universityId?: string) => {
        setUniversityId(universityId);
    };

    const closeUniversityInfos = () => {
        setUniversityId(undefined);
    };

    const handleSetCurrentTandem = (tandem: Tandem, index: number) => {
        setCurrentTandem(tandem);
        setCurrentTandemColor(TANDEM_COLORS[index]);
        setCurrentLearningWorkspace({ learningWorkspace: tandem, index });
    };

    useEffect(() => {
        if (currentTandem && tandems) {
            setCurrentTandemColor(TANDEM_COLORS[tandems.findIndex((tandem) => tandem.id === currentTandem.id) || 0]);
        }
    }, [currentTandem, tandems]);

    return (
        <div
            className={`${styles.content} content-wrapper`}
            style={{ backgroundColor: deviceAdapter.isNativePlatform() ? currentTandemColor : undefined }}
        >
            <h1 className={styles.title}>{`${t('learning.title')}`}</h1>
            <div className={styles.container}>
                {!deviceAdapter.isNativePlatform() && <div className={styles.separator} />}
                <div className={styles.learningLanguageContainer}>
                    <nav>
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
                        {profile.user.university.maxTandemsPerUser > tandems.length && (
                            <IonButton
                                fill="clear"
                                className={styles.addLearningLanguageButton}
                                onClick={openAddLearningLanguagePressed}
                                aria-label={t('learning.add_language') as string}
                            >
                                <IonIcon icon={AddSvg} aria-hidden="true" />
                            </IonButton>
                        )}
                    </nav>
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
                            {currentTandem &&
                                (currentTandem.status === 'DRAFT' || currentTandem.status === 'INACTIVE') && (
                                    <PendingTandemCard
                                        tandem={currentTandem}
                                        onTandemPressed={() => onTandemPressed(currentTandem)}
                                        currentColor={currentTandemColor}
                                    />
                                )}
                            {currentTandem && (
                                <LearningJournalCard
                                    tandem={currentTandem}
                                    onOpenEdito={() => openUniversityInfos(profile.user.university.id)}
                                    currentColor={currentTandemColor}
                                />
                            )}
                            {currentTandem && (
                                <LearningGoalCard
                                    profile={profile}
                                    customLearningGoals={currentTandem.learningLanguage?.customLearningGoals}
                                    onShowAllGoalsPressed={() =>
                                        onShowAllGoalsPressed(currentTandem.learningLanguage?.customLearningGoals)
                                    }
                                />
                            )}
                            {tandems.length > 0 && (
                                <RessourcesCard
                                    onLearningBookPressed={onLearningBookContentPressed}
                                    onVocabularyPressed={onVocabularyListPressed}
                                    onActivityPressed={onActivitiesContentPressed}
                                />
                            )}
                            {currentTandem && currentTandem.partner?.user.university && (
                                <PartnerUniversityCard
                                    university={currentTandem.partner?.user.university}
                                    onPress={() => openUniversityInfos(currentTandem.partner?.user.university.id)}
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
                            {profile.user.university.maxTandemsPerUser > tandems.length && (
                                <CreateLearningLanguageCard onPress={openAddLearningLanguagePressed} />
                            )}
                        </Masonry>
                    </ResponsiveMasonry>
                )}
            </div>
            <EditoContentModal onClose={closeUniversityInfos} profile={profile} universityId={universityId} />
        </div>
    );
};

export default LearningContent;
