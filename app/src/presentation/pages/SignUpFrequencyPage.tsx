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
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import frequencyStyle from './css/SignUpFrequency.module.css';

const frequencies: MeetFrequency[] = [
    'ONCE_A_WEEK',
    'TWICE_A_WEEK',
    'THREE_TIMES_A_WEEK',
    'TWICE_A_MONTH',
    'THREE_TIMES_A_MONTH',
];

const SignUpFrequencyPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const history = useHistory();
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [frequency, setFrequency] = useState<MeetFrequency | undefined>(profileEdit?.frequency);

    const continueSignUp = async () => {
        updateProfileSignUp({ frequency });

        history.push('/signup/end');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={97}
            headerTitle={t('global.create_account_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <div className={frequencyStyle.container}>
                    <h1 className="title">{t('signup_frequency_page.title')}</h1>
                    <span className="subtitle large-margin-bottom">{t('signup_frequency_page.subtitle')}</span>

                    {frequencies.map((freq) => {
                        return (
                            <IonButton
                                key={freq}
                                aria-label={t(`signup_frequency_page.${freq}`) as string}
                                className={`${frequencyStyle['frequency-container']} ${
                                    freq === frequency ? 'primary-selected-button' : ''
                                }`}
                                fill="clear"
                                onClick={() => setFrequency(freq)}
                            >
                                <span className={frequencyStyle['frequency-text']}>
                                    {t(`signup_frequency_page.${freq}`)}
                                </span>
                            </IonButton>
                        );
                    })}
                </div>
                <div className="extra-large-margin-bottom">
                    <p style={{ textAlign: 'center' }}>{t('signup_frequency_page.required_mention')}</p>
                    <IonButton
                        aria-label={t('signup_frequency_page.validate_button') as string}
                        fill="clear"
                        className={`primary-button no-padding ${frequency === undefined ? 'disabled' : ''}`}
                        disabled={frequency === undefined}
                        onClick={continueSignUp}
                    >
                        {t('signup_frequency_page.validate_button')}
                    </IonButton>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpFrequencyPage;
