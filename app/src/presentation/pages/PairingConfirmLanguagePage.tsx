import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { TandemPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { codeLanguageToFlag } from '../utils';
import confirmLanguagesStyles from './css/PairingConfirmLanguage.module.css';
import styles from './css/SignUp.module.css';
import { LearningType } from './PairingPedagogyPage';

const PairingConfirmLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const user = profile?.user;

    if (!profileSignUp.learningLanguage || !user) {
        return <Redirect to="/signup" />;
    }

    const pedagogyToTitle = (pedagogy: Pedagogy | undefined) => {
        switch (pedagogy) {
            case LearningType.BOTH:
                return t('global.tandem_etandem');
            case LearningType.ETANDEM:
                return t('global.etandem');
            case LearningType.TANDEM:
                return t('global.tandem');
            default:
                return '';
        }
    };

    const continueSignUp = async () => {
        return history.push(`/pairing/level/start`);
    };

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
                        {` ${codeLanguageToFlag(profileSignUp.learningLanguage.code)} ${
                            t(`languages_code.${profileSignUp.learningLanguage.code}`)
                        }`}
                    </div>
                    <div className={confirmLanguagesStyles['mode-container']}>
                        <p className={confirmLanguagesStyles['mode-text']}>{`${t(
                            'pairing_confirm_language_page.mode_meet'
                        )} ${pedagogyToTitle(profileSignUp.pedagogy)} ${profileSignUp.pedagogy === LearningType.TANDEM ? ' - ' + profileSignUp.campus?.name : ''} ${codeLanguageToFlag(
                            profileSignUp.learningLanguage.code
                        )}`}</p>
                        <img alt="tandem" src={TandemPng} />
                    </div>
                </div>
                <div className={`large-margin-top extra-large-margin-bottom`}>
                    <button className={`primary-button`} onClick={continueSignUp}>
                        {t('pairing_confirm_language_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingConfirmLanguagePage;
