import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingOptionsStyles from './css/PairingOptions.module.css';
import styles from './css/SignUp.module.css';
import { useStoreState } from '../../store/storeTypes';

const PairingOptionsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getHistoricEmailPartner } = useConfig();
    const history = useHistory();
    const profile = useStoreState((store) => store.profile);
    const profileSignUp = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((store) => store.updateProfileSignUp);
    const [sameTandem, setSameTandem] = useState<boolean>(false);
    const [isForCertificate, setIsForCertificate] = useState<boolean>(false);
    const [isForProgram, setIsForProgram] = useState<boolean>(false);
    const [historicEmailPartner, setHistoricEmailPartner] = useState<string | undefined>(undefined);
    const language = profileSignUp?.learningLanguage;

    if (!profile) {
        return <Redirect to={'/signup'} />;
    }

    if (!language) {
        return <Redirect to={'/pairing/languages'} />;
    }

    const getHistoricEmailPartnerFromApi = async () => {
        const email = await getHistoricEmailPartner.execute(profile.user.id, language.id);
        setHistoricEmailPartner(email);
    };

    const onNextStepPressed = () => {
        updateProfileSignUp({ isForCertificate, isForProgram, sameTandem });
        return history.push(`/pairing/end`);
    };

    const onNonePressed = () => {
        setSameTandem(false);
        setIsForCertificate(false);
        setIsForProgram(false);
    };

    useEffect(() => {
        getHistoricEmailPartnerFromApi();
    }, []);

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
                        {historicEmailPartner && (
                            <button
                                className={pairingOptionsStyles['preference-container']}
                                style={{ background: sameTandem ? configuration.secondaryColor : '#F2F4F7' }}
                                onClick={() => setSameTandem(!sameTandem)}
                            >
                                <p className={pairingOptionsStyles['preference-text']}>
                                    {`${t('pairing_options_page.same_tandem')} : ${historicEmailPartner}`}
                                </p>
                            </button>
                        )}
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

                        <button
                            className={pairingOptionsStyles['preference-container']}
                            style={{
                                background:
                                    !sameTandem && !isForCertificate && !isForProgram
                                        ? configuration.secondaryColor
                                        : '#F2F4F7',
                            }}
                            onClick={onNonePressed}
                        >
                            <p className={pairingOptionsStyles['preference-text']}>{t('pairing_options_page.none')}</p>
                        </button>
                    </div>
                </div>
                <button className={`primary-button extra-large-margin-bottom`} onClick={onNextStepPressed}>
                    {t('pairing_options_page.validate_button')}
                </button>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOptionsPage;
