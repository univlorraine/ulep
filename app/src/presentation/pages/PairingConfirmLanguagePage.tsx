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

import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { TandemPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { codeLanguageToFlag } from '../utils';
import confirmLanguagesStyles from './css/PairingConfirmLanguage.module.css';
import styles from './css/SignUp.module.css';
import { LearningType } from './PairingPedagogyPage';

const PairingConfirmLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const user = profile?.user;

    if (!profileSignUp.learningLanguage || !user) {
        return <Redirect to="/signup" />;
    }

    const campusName = profileSignUp.campus ? ' - ' + profileSignUp.campus.name : '';

    const pedagogyToTitle = (pedagogy: Pedagogy | undefined, campusName: string) => {
        switch (pedagogy) {
            case LearningType.BOTH:
                return t('global.tandem') + ' ' + campusName + ' / ' + t('global.etandem');
            case LearningType.ETANDEM:
                return t('global.etandem');
            case LearningType.TANDEM:
                return t('global.tandem') + ' ' + campusName;
            default:
                return '';
        }
    };

    const continueSignUp = async () => {
        return history.push(`/pairing/level/start`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={36}
            headerTitle={t('global.pairing_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <div>
                    <h1 className="title">{t('pairing_confirm_language_page.title')}</h1>
                    <p className="subtitle">{t('pairing_confirm_language_page.subtitle')}</p>
                    <span>{t('pairing_confirm_language_page.language_title')}</span>
                    <div className={confirmLanguagesStyles['language-container']}>
                        {` ${codeLanguageToFlag(profileSignUp.learningLanguage.code)} ${t(
                            `languages_code.${profileSignUp.learningLanguage.code}`
                        )}`}
                    </div>
                    <div className={confirmLanguagesStyles['mode-container']}>
                        <p className={confirmLanguagesStyles['mode-text']}>{`${t(
                            'pairing_confirm_language_page.mode_meet'
                        )} ${pedagogyToTitle(profileSignUp.pedagogy, campusName)} ${codeLanguageToFlag(
                            profileSignUp.learningLanguage.code
                        )}`}</p>
                        <img alt="" src={TandemPng} aria-hidden={true} />
                    </div>
                </div>
                <div className={`large-margin-top extra-large-margin-bottom`}>
                    <button
                        aria-label={t('pairing_confirm_language_page.validate_button') as string}
                        className={`primary-button`}
                        onClick={continueSignUp}
                    >
                        {t('pairing_confirm_language_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingConfirmLanguagePage;
