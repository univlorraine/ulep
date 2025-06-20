/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
    const { configuration, deviceAdapter, getHistoricEmailPartner } = useConfig();
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
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
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
                        {profile.user.university.isCentral && (
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
                        )}

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
