import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import { codeCountryToFlag } from '../utils';
import styles from './css/SignUp.module.css';
import pairingLanguagesStyles from './css/SignUpPairingLanguages.module.css';

const SignUpPairingLaguages: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();

    const getLanguages = async () => {
        let result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        if (!profileSignUp.university?.isCentral) {
            result = result.filter((language) => language.code === 'FR' || language.code === 'EN');
        }

        return setLanguages(result);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLaguage });
        history.push('/signup/'); // TODO: Change this
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
                    <h1 className={pairingLanguagesStyles.title}>{t('signup_pairing_languages_page.title')}</h1>
                    <p className={pairingLanguagesStyles.subtitle}>{t('signup_pairing_languages_page.subtitle')}</p>

                    <div className={pairingLanguagesStyles['languages-container']}>
                        {languages
                            .filter((language) => language.enabled)
                            .map((language) => {
                                return (
                                    <button
                                        key={language.code}
                                        className={pairingLanguagesStyles['language-container']}
                                        style={{
                                            backgroundColor:
                                                selectedLaguage?.code === language.code
                                                    ? configuration.secondaryDarkColor
                                                    : configuration.secondaryColor,
                                        }}
                                        onClick={() => setSelectedLanguage(language)}
                                    >
                                        <span className={pairingLanguagesStyles.flag}>
                                            {codeCountryToFlag(language.code.toLowerCase())}
                                        </span>
                                        <span className={pairingLanguagesStyles.country}>{language.name}</span>
                                    </button>
                                );
                            })}
                        {profileSignUp.university?.isCentral && (
                            <button
                                style={{ background: 'none' }}
                                onClick={() => history.push('/signup/pairing/other-languages')}
                            >
                                <img
                                    alt="plus"
                                    className={pairingLanguagesStyles['language-container']}
                                    src={'assets/plus.svg'}
                                />
                            </button>
                        )}
                    </div>
                </div>
                <div className={`${pairingLanguagesStyles['bottom-container']} large-margin-top large-margin-bottom`}>
                    <button
                        className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                        disabled={!selectedLaguage}
                        onClick={continueSignUp}
                    >
                        {t('signup_pairing_languages_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpPairingLaguages;
