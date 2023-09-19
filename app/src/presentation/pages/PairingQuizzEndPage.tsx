import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const PairingQuizzEndPage: React.FC = ({}) => {
    const { configuration } = useConfig();
    const history = useHistory();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const { t } = useTranslation();

    if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
        return <Redirect to={`${isSignUp ? '/' + isSignUp : ''}/pairing/languages`} />;
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
                    onNextStep={() => history.push(`${isSignUp ? '/' + isSignUp : ''}/pairing/preference`)}
                    quizzLevel={profileSignUp.learningLanguageLevel}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzEndPage;
