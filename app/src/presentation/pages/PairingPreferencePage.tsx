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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingPreferenceStyles from './css/PairingPreference.module.css';
import styles from './css/SignUp.module.css';

const PairingPreferencePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const updateProfileSignUp = useStoreActions((store) => store.updateProfileSignUp);
    const history = useHistory();
    const [sameAge, setSameAge] = useState<boolean>(false);
    const [sameGender, setSameGender] = useState<boolean>(false);

    const onNonePressed = () => {
        setSameAge(false);
        setSameGender(false);
    };

    const onNextStepPressed = () => {
        updateProfileSignUp({ sameAge, sameGender });
        return history.push(`/pairing/options`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={72}
            headerTitle={t('global.pairing_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <div>
                    <h1 className="title">{t('pairing_preference_page.title')}</h1>
                    <div className={pairingPreferenceStyles.content}>
                        <IonButton
                            aria-label={t('pairing_preference_page.same_gender') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                sameGender ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={() => setSameGender(!sameGender)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_gender')}
                            </p>
                        </IonButton>
                        <IonButton
                            aria-label={t('pairing_preference_page.same_age') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                sameAge ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={() => setSameAge(!sameAge)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_age')}
                            </p>
                        </IonButton>
                        <IonButton
                            aria-label={t('pairing_preference_page.none') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                !sameAge && !sameGender ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={onNonePressed}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.none')}
                            </p>
                        </IonButton>
                    </div>
                </div>
                <IonButton
                    aria-label={t('pairing_preference_page.validate_button') as string}
                    fill="clear"
                    className="primary-button extra-large-margin-bottom no-padding"
                    onClick={onNextStepPressed}
                >
                    {t('pairing_preference_page.validate_button')}
                </IonButton>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingPreferencePage;
