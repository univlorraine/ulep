import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import styles from './css/SignUp.module.css';

const PairingQuizzEndPage = ({}) => {
    const { configuration } = useConfig();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const { t } = useTranslation();

    if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
        return <Redirect to="/signup/pairing/languages" />;
    }

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={72}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <QuizzValidatedContent
                    language={profileSignUp.learningLanguage}
                    onNextStep={() => history.push('/signup/pairing/preference')}
                    quizzLevel={profileSignUp.learningLanguageLevel}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzEndPage;
