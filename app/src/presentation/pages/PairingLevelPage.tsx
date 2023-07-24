import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import ColoredCard from '../components/ColoredCard';
import WebLayoutCentered from '../components/WebLayoutCentered';
import pairingPedagogyStyles from './css/PairingPedagogy.module.css';
import styles from './css/SignUp.module.css';

const PairingLevelPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={48}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div className={pairingPedagogyStyles.content}>
                    <h1 className={pairingPedagogyStyles.title}>{t('pairing_pedagogy_page.title')}</h1>
                    <p className={pairingPedagogyStyles.subtitle}>{t('pairing_pedagogy_page.subtitle')}</p>

                    <ColoredCard<undefined>
                        buttonName={t('pairing_level_page.know_button')}
                        color={'#8BC4C4'}
                        onPressed={() => history.push('/signup/')}
                        title={t('pairing_level_page.know_title')}
                        value={undefined}
                    />

                    <ColoredCard<undefined>
                        buttonName={t('pairing_level_page.unknow_button')}
                        color={'#7997C6'}
                        onPressed={() => history.push('/signup/')}
                        title={t('pairing_level_page.unknow_title')}
                        value={undefined}
                    />
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLevelPage;
