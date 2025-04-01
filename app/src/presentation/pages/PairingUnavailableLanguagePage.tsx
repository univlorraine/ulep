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

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import LanguageSelectedContent from '../components/contents/LanguageSelectedContent';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/layout/SuccessLayout';
import styles from './css/PairingUnavailableLanguage.module.css';

interface PairingUnavailableLanguageState {
    askingStudents: number;
}

const PairingUnavailableLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const history = useHistory();
    const location = useLocation<PairingUnavailableLanguageState>();
    const { askingStudents } = location.state || {};
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const language = profileSignUp.learningLanguage;
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);
    const user = profile?.user;

    const navigateToRessource = () => {
        window.open(configuration.ressourceUrl, '_blank');
    };

    if (!language || !user) {
        return <Redirect to={`/pairing/languages`} />;
    }

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={`${styles.container} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                {askingStudents > 0 && !isLastStep && (
                    <LanguageSelectedContent
                        language={language}
                        mode="unavailable"
                        user={user}
                        onNextPressed={() => setIsLastStep(true)}
                    />
                )}
                {(askingStudents === 0 || isLastStep) && (
                    <>
                        <FlagBubble language={language} textColor="white" isSelected disabled />
                        <span className="title">{`${t('pairing_unavailable_language_page.title')}`}</span>
                        <p className={styles.description}>{t('pairing_unavailable_language_page.subtitle')}</p>
                        <span className={styles.description}>{t('pairing_unavailable_language_page.luck')}</span>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.next_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <button
                                    aria-label={t('pairing_unavailable_language_page.next_button') as string}
                                    className="primary-button"
                                    onClick={() => history.push('/pairing/languages')}
                                >
                                    {t('pairing_unavailable_language_page.next_button')}
                                </button>
                            </div>
                        </div>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.pedagogy_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <button
                                    aria-label={t('pairing_unavailable_language_page.pedagogy_button') as string}
                                    className="primary-button"
                                    onClick={() => history.replace('/pairing/pedagogy')}
                                >
                                    {t('pairing_unavailable_language_page.pedagogy_button')}
                                </button>
                            </div>
                        </div>
                        <div className={styles['bottom-container']}>
                            <p className={styles['button-title']}>
                                {t('pairing_unavailable_language_page.ressource_title')}
                            </p>
                            <div className={styles['button-container']}>
                                <button
                                    aria-label={t('pairing_unavailable_language_page.ressource_button') as string}
                                    onClick={navigateToRessource}
                                    className="primary-button"
                                >
                                    {t('pairing_unavailable_language_page.ressource_button')}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SuccessLayout>
    );
};

export default PairingUnavailableLanguagePage;
