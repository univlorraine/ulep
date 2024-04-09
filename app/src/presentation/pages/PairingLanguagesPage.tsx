import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingLanguagesStyles from './css/PairingLanguages.module.css';
import styles from './css/SignUp.module.css';
import Loader from '../components/Loader';

type PairingLanguagesPageProps = {
    isProficiencyTest?: boolean;
};

const PairingLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages, getUniversityLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const location = useLocation<PairingLanguagesPageProps>();
    const isProficiencyTest = location.state?.isProficiencyTest;
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const getLanguages = async () => {
        setIsLoadingLanguages(true);
        let [globalLanguages, universityLanguages] = await Promise.all([
            getAllLanguages.execute(university.isCentral ? 'PRIMARY' : 'PARTNER'),
            getUniversityLanguages.execute(university.id),
        ]);
        setIsLoadingLanguages(false);

        if (globalLanguages instanceof Error) {
            return await showToast({ message: t(globalLanguages.message), duration: 1000 });
        }

        if (universityLanguages instanceof Error) {
            return await showToast({ message: t(universityLanguages.message), duration: 1000 });
        }

        const learnableLanguages = [...globalLanguages, ...universityLanguages].filter(
            (language) =>
                profile?.nativeLanguage.code !== language.code &&
                (isProficiencyTest ||
                    !profile?.learningLanguages?.find((learningLanguage) => language.code === learningLanguage.code))
        );

        return setLanguages(learnableLanguages);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLanguage });

        return history.push(`/pairing/pedagogy`);
    };

    const continueProficiencyTest = async () => {
        const languageLevel = [...profile.learningLanguages, ...profile.testedLanguages].find(
            (language) => language.code === selectedLanguage?.code
        )?.level;

        updateProfileSignUp({ learningLanguage: selectedLanguage });

        return history.push(`/pairing/language/quizz`, {
            isProficiencyTest: true,
            isNewLanguage: !languageLevel,
            languageLevel: languageLevel && languageLevel !== 'A0' ? languageLevel : 'A1',
        });
    };

    const nextStep = () => {
        if (isProficiencyTest) {
            return continueProficiencyTest();
        }

        return continueSignUp();
    };

    const navigateToHome = () => {
        return history.push('/home');
    };

    const otherLanguage = () => {
        return history.push(`/pairing/other-languages`, { isProficiencyTest });
    };

    useEffect(() => {
        getLanguages();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={12}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div className={pairingLanguagesStyles.content}>
                    <h1 className="title">{t('pairing_languages_page.title')}</h1>
                    {isLoadingLanguages ? (
                        <div className={pairingLanguagesStyles.loader}>
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <p className="subtitle">
                                {t(
                                    languages.length
                                        ? 'pairing_languages_page.subtitle'
                                        : 'pairing_languages_page.no_languages'
                                )}
                            </p>
                            <div className={pairingLanguagesStyles['languages-container']}>
                                {!!languages.length &&
                                    languages.map((language) => {
                                        return (
                                            <FlagBubble
                                                key={language.code}
                                                isSelected={selectedLanguage?.code === language.code}
                                                language={language}
                                                onPressed={setSelectedLanguage}
                                            />
                                        );
                                    })}
                                {!isLoadingLanguages && university.isCentral && (
                                    <button style={{ background: 'none' }} onClick={otherLanguage}>
                                        <img alt="plus" className={pairingLanguagesStyles.image} src={PlusPng} />
                                    </button>
                                )}
                            </div>
                            <div className={`extra-large-margin-bottom`}>
                                {!!languages.length && (
                                    <button
                                        className={`primary-button ${!selectedLanguage ? 'disabled' : ''}`}
                                        disabled={!selectedLanguage}
                                        onClick={nextStep}
                                    >
                                        {t('pairing_languages_page.validate_button')}
                                    </button>
                                )}
                                {!languages.length && (
                                    <button className={`primary-button`} onClick={navigateToHome}>
                                        {t('pairing_languages_page.home_button')}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLanguagesPage;
