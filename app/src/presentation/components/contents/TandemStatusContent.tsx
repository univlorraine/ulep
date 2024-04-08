import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, ClockPng, CloseBlackSvg, TandemNotFoundPng } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import styles from './TandemStatusContent.module.css';

interface TandemStatusContentProps {
    onFindNewTandem: () => void;
    onClose: () => void;
    status?: TandemStatus;
}

const TandemStatusContent: React.FC<TandemStatusContentProps> = ({ onFindNewTandem, onClose, status }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const waiting = status === 'DRAFT' || status === 'VALIDATED_BY_ONE_UNIVERSITY';
    const tradKey = waiting ? 'draft' : 'not_found';
    return (
        <div
            className={`${styles.container} content-wrapper`}
            style={{ backgroundColor: configuration.secondaryColor }}
        >
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <button
                aria-label=""
                className={styles['close-container']}
                style={{ justifyContent: !isHybrid ? 'flex-end' : 'flex-start' }}
                onClick={onClose}
            >
                <img alt="" src={!isHybrid ? CloseBlackSvg : ArrowLeftSvg} />
            </button>
            <div className={styles.content}>
                <span className="title extra-large-margin-bottom">{t(`home_page.tandem_${tradKey}.title`)}</span>
                <img alt="clock" className="extra-large-margin-bottom" src={waiting ? ClockPng : TandemNotFoundPng} />
                <span className="subtitle extra-large-margin-bottom">{t(`home_page.tandem_${tradKey}.subtitle`)}</span>
                {status === 'INACTIVE' && (
                    <div className={styles['bottom-container']}>
                        <button
                            aria-label={t('home_page.tandem_not_found.button_pass') as string}
                            className="tertiary-button extra-large-margin-bottom"
                            onClick={onClose}
                        >
                            {t('home_page.tandem_not_found.button_pass')}
                        </button>
                        <button
                            aria-label={t('home_page.tandem_not_found.button') as string}
                            className="primary-button extra-large-margin-bottom"
                            onClick={onClose}
                        >
                            {t('home_page.tandem_not_found.button')}
                        </button>
                    </div>
                )}
                {waiting && (
                    <button
                        aria-label={t('home_page.tandem_draft.button') as string}
                        className="primary-button extra-large-margin-bottom"
                        onClick={onClose}
                    >
                        {t('home_page.tandem_draft.button')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TandemStatusContent;
