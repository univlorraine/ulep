import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import WebLayoutCentered from '../components/WebLayoutCentered';
import pairingLanguagesStyles from './css/PairingLanguages.module.css';
import styles from './css/SignUp.module.css';

const PairingLaguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();

    const getLanguages = async () => {
        let result = await getAllLanguages.execute(); // TODO: Change this later, use university ( profileSignUp.primaryLanguages )

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        if (!profileSignUp.university?.isCentral) {
            // TODO: Remove this later, use university ( profileSignUp.primaryLanguages )
            result = result.filter((language) => language.code === 'FR' || language.code === 'EN');
        }

        return setLanguages(result);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLaguage });
        history.push('/signup/pairing/pedagogy');
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
                    <h1 className={pairingLanguagesStyles.title}>{t('pairing_languages_page.title')}</h1>
                    <p className={pairingLanguagesStyles.subtitle}>{t('pairing_languages_page.subtitle')}</p>

                    <div className={pairingLanguagesStyles['languages-container']}>
                        {languages
                            .filter((language) => language.enabled)
                            .map((language) => {
                                return (
                                    <FlagBubble
                                        isSelected={selectedLaguage?.code === language.code}
                                        language={language}
                                        onPressed={setSelectedLanguage}
                                    />
                                );
                            })}
                        {profileSignUp.university?.isCentral && (
                            <button
                                style={{ background: 'none' }}
                                onClick={() => history.push('/signup/pairing/other-languages')}
                            >
                                <img alt="plus" className={pairingLanguagesStyles.image} src={'assets/plus.svg'} />
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
                        {t('pairing_languages_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLaguagesPage;
