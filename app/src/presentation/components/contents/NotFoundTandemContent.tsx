import { useTranslation } from 'react-i18next';
import { ReactComponent as Background } from '../../../../public/assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import styles from './TandemContent.module.css';

interface NotFoundTandemContentProps {
    onFindNewTandem: () => void;
    onClose: () => void;
}

const NotFoundTandemContent: React.FC<NotFoundTandemContentProps> = ({ onClose }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <div className={styles.container} style={{ backgroundColor: configuration.secondaryColor }}>
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <button
                className={styles['close-container']}
                style={{ justifyContent: !isHybrid ? 'flex-end' : 'flex-start' }}
                onClick={onClose}
            >
                <img alt="left-arrow" src={`/assets/${!isHybrid ? 'close_black' : 'left-arrow'}.svg`} />
            </button>
            <div className={styles.content}>
                <span className="title extra-large-margin-bottom">{t('home_page.tandem_not_found.title')}</span>
                <img alt="clock" className="extra-large-margin-bottom" src="/assets/tandem_not_found.svg" />
                <span className="subtitle extra-large-margin-bottom">{t('home_page.tandem_not_found.subtitle')}</span>
                <div className={styles['bottom-container']}>
                    <button className="tertiary-button extra-large-margin-bottom" onClick={onClose}>
                        {t('home_page.tandem_not_found.button_pass')}
                    </button>
                    <button className="primary-button extra-large-margin-bottom" onClick={onClose}>
                        {t('home_page.tandem_not_found.button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundTandemContent;
