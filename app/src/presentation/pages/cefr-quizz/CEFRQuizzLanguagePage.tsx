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

import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Language from '../../../domain/entities/Language';
import { useStoreState } from '../../../store/storeTypes';
import useGetLearnableLanguages from '../../hooks/useGetLearnableLanguages';
import LearnableLanguagesContent from '../../components/contents/LearnableLanguagesContent';
import WebLayoutCentered from '../../components/layout/WebLayoutCentered';
import styles from '../css/SignUp.module.css';
import { useConfig } from '../../../context/ConfigurationContext';

const CEFRQuizzLanguagePage: React.FC = () => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const history = useHistory();
    const { configuration } = useConfig();
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const { error, isLoading, languages } = useGetLearnableLanguages(university, true, []);

    if (error) {
        showToast({ message: t(error.message), duration: 1000 });
    }

    const startTest = async (selectedLanguage: Language) => {
        const languageLevel = [...profile.learningLanguages, ...profile.testedLanguages].find(
            (language) => language.code === selectedLanguage?.code
        )?.level;

        return history.push(`/cefr/quizz`, {
            initialCefr: languageLevel ?? undefined,
            isQuizzTest: true,
            language: selectedLanguage,
        });
    };

    const navigateToHome = () => {
        return history.push('/home');
    };

    const otherLanguages = () => {
        return history.push(`/cefr/languages/other`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={100}
            headerTitle={t('global.cefr_quizz_title')}
        >
            <div className={styles.body}>
                <LearnableLanguagesContent
                    abortStep={navigateToHome}
                    isLoading={isLoading}
                    languages={languages}
                    navigateToOtherLanguages={otherLanguages}
                    nextStep={startTest}
                    university={university}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default CEFRQuizzLanguagePage;
