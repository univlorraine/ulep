import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/SuccessLayout';
import { codeCountryToFlag } from '../utils';
import styles from './css/PairingFinalPage.module.css';

const PairingFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { configuration } = useConfig();
    const profileSignUp = useStoreState((payload) => payload.profileSignUp);

    if (!profileSignUp.learningLanguage) {
        return <Redirect to="/signup/pairing/languages" />;
    }

    // @ts-ignore
    const learningLanguage = new Language(profileSignUp.learningLanguage._code, profileSignUp.learningLanguage._name);

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.container}>
                <h1 className="title">{t('pairing_final_page.title')}</h1>
                <div className={styles['image-container']}>
                    <img className={styles.image} alt="avatar" src={profileSignUp.profilePicture}></img>
                    <div className={styles.bubble}>
                        <FlagBubble language={learningLanguage} textColor="white" isSelected disabled />
                    </div>
                </div>
                <div className={`${styles['tandem-container']}`}>{`${t('global.tandem')} ${
                    learningLanguage.name
                } ${codeCountryToFlag(learningLanguage.code)}`}</div>
                <span className={`${styles.description} large-margin-top`}>{`${t(
                    'pairing_final_page.congratulation'
                )},`}</span>
                <span className={styles.description}>{t('pairing_final_page.congratulation_text')}</span>
                <button
                    className="primary-button large-margin-top"
                    onClick={() => history.push('/signup/pairing/languages')}
                >
                    {t('pairing_final_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default PairingFinalPage;
