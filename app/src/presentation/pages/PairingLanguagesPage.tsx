import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingLanguagesStyles from './css/PairingLanguages.module.css';
import styles from './css/SignUp.module.css';
import { TailSpin } from 'react-loader-spinner';

const PairingLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(false);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const getLanguages = async () => {
        setIsLoadingLanguages(true);
        let result = await getAllLanguages.execute(university.isCentral ? 'PRIMARY' : 'PARTNER');
        setIsLoadingLanguages(false);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(
            result.filter(
                (language) =>
                    profile?.nativeLanguage.code !== language.code &&
                    !profile?.learningLanguages?.find((learningLanguage) => language.code === learningLanguage.code)
            )
        );
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLaguage });
        return history.push(`/pairing/pedagogy`);
    };

    const navigateToHome = () => {
        return (window.location.href = '/home');
    };

    const otherLanguage = () => {
        return history.push(`/pairing/other-languages`);
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
                            <TailSpin
                                color={configuration.primaryColor}
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                visible={true}
                            />
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
                                                isSelected={selectedLaguage?.code === language.code}
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
                                        className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                                        disabled={!selectedLaguage}
                                        onClick={continueSignUp}
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
