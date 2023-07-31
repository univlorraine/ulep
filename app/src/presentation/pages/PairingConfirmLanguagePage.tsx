import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import SuccessLayout from '../components/SuccessLayout';
import WebLayoutCentered from '../components/WebLayoutCentered';
import LanguageSelectedContent from '../components/contents/LanguageSelectedContent';
import { codeCountryToFlag } from '../utils';
import confirmLanguagesStyles from './css/PairingConfirmLanguage.module.css';
import styles from './css/SignUp.module.css';

const PairingConfirmLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    if (!profileSignUp.learningLanguage) {
        return <Redirect to="/signup" />;
    }

    const pedagogyToTitle = (pedagogy: Pedagogy | undefined) => {
        switch (pedagogy) {
            case 'BOTH':
                return t('global.tandem_etandem');
            case 'ETANDEM':
                return t('global.etandem');
            case 'TANDEM':
                return t('global.tandem');
            default:
                return '';
        }
    };

    const continueSignUp = async () => {
        if (profileSignUp.learningLanguageLevel) {
            return history.push('/signup/pairing/preference');
        }
        return history.push('/signup/pairing/level');
    };

    if (isConfirmed) {
        return (
            <SuccessLayout
                backgroundColorCode={configuration.secondaryDarkColor}
                backgroundIconColor={configuration.secondaryBackgroundImageColor}
                colorCode={configuration.secondaryColor}
            >
                <div className={styles.body}>
                    <LanguageSelectedContent
                        language={profileSignUp.learningLanguage}
                        mode={'confirm'}
                        profilePicture={profileSignUp.profilePicture}
                        onNextPressed={continueSignUp}
                    />
                </div>
            </SuccessLayout>
        );
    }

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={36}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_confirm_language_page.title')}</h1>
                    <p className="subtitle">{t('pairing_confirm_language_page.subtitle')}</p>
                    <span>{t('pairing_confirm_language_page.language_title')}</span>
                    <div className={confirmLanguagesStyles['language-container']}>
                        {` ${codeCountryToFlag(profileSignUp.learningLanguage.code)} ${
                            profileSignUp.learningLanguage.name
                        }`}
                    </div>
                    <div className={confirmLanguagesStyles['mode-container']}>
                        <p className={confirmLanguagesStyles['mode-text']}>{`${t(
                            'pairing_confirm_language_page.mode_meet'
                        )} ${pedagogyToTitle(profileSignUp.pedagogy)}  ${codeCountryToFlag(
                            profileSignUp.learningLanguage.code
                        )}`}</p>
                        <img alt="tandem" src="/assets/tandem.svg" />
                    </div>
                </div>
                <div className={`large-margin-top extra-large-margin-bottom`}>
                    <button className={`primary-button `} onClick={() => setIsConfirmed(true)}>
                        {t('pairing_confirm_language_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingConfirmLanguagePage;
