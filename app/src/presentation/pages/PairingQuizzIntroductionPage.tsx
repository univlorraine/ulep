import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { StarPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import quizzIntroductionStyle from './css/PairingQuizzIntroduction.module.css';
import styles from './css/SignUp.module.css';

const PairingQuizzIntroductionPage: React.FC = ({}) => {
    const { configuration } = useConfig();
    const history = useHistory();
    const { t } = useTranslation();

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={60}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div className={quizzIntroductionStyle.container}>
                    <h1 className="title">{t('pairing_quizz_introduction_page.title')}</h1>
                    <p className="subtitle">{t('pairing_quizz_introduction_page.subtitle')}</p>
                    <img alt="star" className={quizzIntroductionStyle.image} src={StarPng} />
                    <p className={quizzIntroductionStyle.description}>
                        {t('pairing_quizz_introduction_page.description')}
                    </p>
                    <div className={quizzIntroductionStyle.time}>{t('pairing_quizz_introduction_page.time')}</div>
                </div>
                <div>
                    <button
                        className="primary-button extra-large-margin-bottom"
                        onClick={() => history.push(`/pairing/language/quizz`)}
                    >
                        {t('pairing_quizz_introduction_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzIntroductionPage;
