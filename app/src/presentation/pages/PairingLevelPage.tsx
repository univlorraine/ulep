import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import ColoredCard from '../components/ColoredCard';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const PairingLevelPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const history = useHistory();

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={48}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_level_page.title')}</h1>
                    <p className="subtitle">{t('pairing_level_page.subtitle')}</p>

                    <ColoredCard<undefined>
                        buttonName={t('pairing_level_page.know_button')}
                        color={'#8BC4C4'}
                        onPressed={() => history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/level/select`)}
                        title={t('pairing_level_page.know_title')}
                        value={undefined}
                    />

                    <ColoredCard<undefined>
                        buttonName={t('pairing_level_page.unknow_button')}
                        color={'#7997C6'}
                        onPressed={() =>
                            history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/language/quizz/introduction`)
                        }
                        title={t('pairing_level_page.unknow_title')}
                        value={undefined}
                    />
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLevelPage;
