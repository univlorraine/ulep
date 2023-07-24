import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import pedagogy from '../../domain/entities/pedagogy';
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

    // @ts-ignore
    const learningLanguage = new Language(profileSignUp.learningLanguage._code, profileSignUp.learningLanguage._name);

    const pedagogyToTitle = (pedagogy: pedagogy | undefined) => {
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
        history.push('/signup/pairing/level');
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
                        language={learningLanguage}
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
                <div className={confirmLanguagesStyles.content}>
                    <h1 className={confirmLanguagesStyles.title}>{t('pairing_confirm_language_page.title')}</h1>
                    <p className={confirmLanguagesStyles.subtitle}>{t('pairing_confirm_language_page.subtitle')}</p>
                    <span>{t('pairing_confirm_language_page.language_title')}</span>
                    <div className={confirmLanguagesStyles['language-container']}>
                        {` ${codeCountryToFlag(learningLanguage.code)} ${learningLanguage.name}`}
                    </div>
                    <div className={confirmLanguagesStyles['mode-container']}>
                        <p className={confirmLanguagesStyles['mode-text']}>{`${t(
                            'pairing_confirm_language_page.mode_meet'
                        )} ${pedagogyToTitle(profileSignUp.pedagogy)}  ${codeCountryToFlag(learningLanguage.code)}`}</p>
                        <img alt="tandem" src="/assets/tandem.svg" />
                    </div>
                </div>
                <div className={`${confirmLanguagesStyles['bottom-container']} large-margin-top large-margin-bottom`}>
                    <button className={`primary-button `} onClick={() => setIsConfirmed(true)}>
                        {t('pairing_confirm_language_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingConfirmLanguagePage;
