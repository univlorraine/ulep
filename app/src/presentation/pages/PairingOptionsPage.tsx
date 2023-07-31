import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import pairingOptionsStyles from './css/PairingOptions.module.css';
import styles from './css/SignUp.module.css';

const PairingOptionsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const updateProfileSignUp = useStoreActions((store) => store.updateProfileSignUp);
    const history = useHistory();
    const [sameTandem, setSameTandem] = useState<boolean>(false);
    const [isForCertificate, setIsForCertificate] = useState<boolean>(false);
    const [isForProgram, setIsForProgram] = useState<boolean>(false);

    const onNextStepPressed = () => {
        updateProfileSignUp({ sameTandem, isForCertificate, isForProgram });
        return history.push('/signup/pairing/end');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={84}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_options_page.title')}</h1>
                    <div className={pairingOptionsStyles.content}>
                        <button
                            className={pairingOptionsStyles['preference-container']}
                            style={{ background: sameTandem ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={() => setSameTandem(!sameTandem)}
                        >
                            <p className={pairingOptionsStyles['preference-text']}>
                                {t('pairing_options_page.same_tandem')}
                            </p>
                        </button>
                        <button
                            className={pairingOptionsStyles['preference-container']}
                            style={{ background: isForCertificate ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={() => setIsForCertificate(!isForCertificate)}
                        >
                            <p className={pairingOptionsStyles['preference-text']}>
                                {t('pairing_options_page.certificat')}
                            </p>
                        </button>
                        <button
                            className={pairingOptionsStyles['preference-container']}
                            style={{ background: isForProgram ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={() => setIsForProgram(!isForProgram)}
                        >
                            <span className={pairingOptionsStyles['preference-text']}>
                                {t('pairing_options_page.program')}
                            </span>
                            <span className={pairingOptionsStyles['preference-description']}>
                                {t('pairing_options_page.program_subtitle')}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="extra-large-margin-bottom">
                    <button className="primary-button large-margin-bottom" onClick={onNextStepPressed}>
                        {t('pairing_options_page.validate_button')}
                    </button>
                    <button className="secondary-button" onClick={() => history.push('/signup/pairing/end')}>
                        {t('pairing_options_page.pass_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOptionsPage;
