import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useParams } from 'react-router';
import { PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingLanguagesStyles from './css/PairingLanguages.module.css';
import styles from './css/SignUp.module.css';

const PairingLaguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const university = profileSignUp.university || profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const getLanguages = async () => {
        let result = await getAllLanguages.execute('PRIMARY');

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        if (isSignUp) {
            return setLanguages(
                result.filter(
                    (language) =>
                        profileSignUp.nativeLanguage?.code !== language.code &&
                        !profileSignUp.otherLanguages?.find((otherLanguage) => language.code === otherLanguage.code)
                )
            );
        }
        return setLanguages(
            result.filter(
                (language) =>
                    profile?.nativeLanguage.code !== language.code &&
                    !profile?.masteredLanguages?.find((otherLanguage) => language.code === otherLanguage.code)
            )
        );
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLaguage });
        return history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/pedagogy`);
    };

    const otherLanguage = () => {
        return history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/other-languages`);
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
                    <p className="subtitle">{t('pairing_languages_page.subtitle')}</p>

                    <div className={pairingLanguagesStyles['languages-container']}>
                        {languages.map((language) => {
                            return (
                                <FlagBubble
                                    key={language.code}
                                    isSelected={selectedLaguage?.code === language.code}
                                    language={language}
                                    onPressed={setSelectedLanguage}
                                />
                            );
                        })}
                        {university.isCentral && (
                            <button style={{ background: 'none' }} onClick={otherLanguage}>
                                <img alt="plus" className={pairingLanguagesStyles.image} src={PlusPng} />
                            </button>
                        )}
                    </div>
                </div>
                <div className={`extra-large-margin-bottom`}>
                    <button
                        className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                        disabled={!selectedLaguage}
                        onClick={continueSignUp}
                    >
                        {t('pairing_languages_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLaguagesPage;
