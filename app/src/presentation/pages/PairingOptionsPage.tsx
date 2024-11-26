import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingOptionsStyles from './css/PairingOptions.module.css';
import styles from './css/SignUp.module.css';

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
                            <IonButton
                                aria-label={`${t('pairing_options_page.same_tandem')} : ${historicEmailPartner}`}
                                className={`${pairingOptionsStyles['preference-container']} ${
                                    sameTandem ? 'secondary-selected-button' : ''
                                } no-padding`}
                                fill="clear"
                                onClick={() => setSameTandem(!sameTandem)}
                            >
                                <p className={pairingOptionsStyles['preference-text']}>
                                    {`${t('pairing_options_page.same_tandem')} : ${historicEmailPartner}`}
                                </p>
                            </IonButton>
                        )}
                        <IonButton
                            aria-label={t('pairing_options_page.certificat') as string}
                            className={`${pairingOptionsStyles['preference-container']} ${
                                isForCertificate ? 'secondary-selected-button' : ''
                            } no-padding`}
                            fill="clear"
                            onClick={() => setIsForCertificate(!isForCertificate)}
                        >
                            <p className={pairingOptionsStyles['preference-text']}>
                                {t('pairing_options_page.certificat')}
                            </p>
                        </IonButton>
                        <IonButton
                            aria-label={t('pairing_options_page.program') as string}
                            className={`${pairingOptionsStyles['preference-container']} ${
                                isForProgram ? 'secondary-selected-button' : ''
                            } no-padding`}
                            fill="clear"
                            onClick={() => setIsForProgram(!isForProgram)}
                        >
                            <div>
                                <span className={pairingOptionsStyles['preference-text']}>
                                    {t('pairing_options_page.program')}
                                </span>
                                <br />
                                <span className={pairingOptionsStyles['preference-description']}>
                                    {t('pairing_options_page.program_subtitle')}
                                </span>
                            </div>
                        </IonButton>

                        <IonButton
                            aria-label={t('pairing_options_page.none') as string}
                            className={`${pairingOptionsStyles['preference-container']} ${
                                !sameTandem && !isForCertificate && !isForProgram ? 'secondary-selected-button' : ''
                            } no-padding`}
                            fill="clear"
                            onClick={onNonePressed}
                        >
                            <p className={pairingOptionsStyles['preference-text']}>{t('pairing_options_page.none')}</p>
                        </IonButton>
                    </div>
                </div>
                <IonButton
                    aria-label={t('pairing_options_page.validate_button') as string}
                    className={`primary-button extra-large-margin-bottom no-padding`}
                    fill="clear"
                    onClick={onNextStepPressed}
                >
                    {t('pairing_options_page.validate_button')}
                </IonButton>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOptionsPage;
