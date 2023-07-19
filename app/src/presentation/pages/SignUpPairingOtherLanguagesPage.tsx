import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions } from '../../store/storeTypes';
import Checkbox from '../components/Checkbox';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import pairingOtherLanguagesStyles from './css/SignUpPairingOtherLanguages.module.css';

const SignUpPairingOtherLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();

    const getLanguages = async () => {
        let result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(result);
    };

    const continueSignUp = async () => {
        if (selectedLaguage?.code === 'joker') {
            return history.push('/signup/'); // we dont update signUpProfile because joker is null in api
        }

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
                <div className={pairingOtherLanguagesStyles.content}>
                    <h1 className={pairingOtherLanguagesStyles.title}>
                        {t('signup_pairing_other_languages_page.title')}
                    </h1>
                    <p className={pairingOtherLanguagesStyles.subtitle}>
                        {t('signup_pairing_other_languages_page.subtitle')}
                    </p>

                    <div className={pairingOtherLanguagesStyles['joker-container']}>
                        <img alt="dice" src="/assets/dice.svg" />
                        <div className={pairingOtherLanguagesStyles['joker-text-container']}>
                            <p className={pairingOtherLanguagesStyles['joker-description']}>
                                {t('signup_pairing_other_languages_page.joker_description')}
                            </p>
                            <Checkbox
                                isSelected={selectedLaguage?.code === 'joker'}
                                onPressed={() => setSelectedLanguage(new Language('joker', 'joker', true))}
                                name={t('signup_pairing_other_languages_page.joker_checkbox')}
                                textClass={pairingOtherLanguagesStyles['checkbox-text']}
                            />
                        </div>
                    </div>

                    <div style={{ columnCount: 2, marginTop: 44 }}>
                        {languages.map((language) => {
                            return (
                                <div key={language.code} style={{ marginBottom: 20 }}>
                                    <Checkbox
                                        isSelected={language.code === selectedLaguage?.code}
                                        onPressed={() => setSelectedLanguage(language)}
                                        name={language.name}
                                        textClass={pairingOtherLanguagesStyles['checkbox-text']}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className={`${pairingOtherLanguagesStyles['bottom-container']} large-margin-top large-margin-bottom`}
                >
                    <button
                        className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                        disabled={!selectedLaguage}
                        onClick={continueSignUp}
                    >
                        {t('signup_pairing_other_languages_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpPairingOtherLanguagesPage;
