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
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import LearnableLanguagesContent from '../components/contents/LearnableLanguagesContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import useGetLearnableLanguages from '../hooks/useGetLearnableLanguages';
import useLimitedFeatures from '../hooks/useLimitedFeatures';
import styles from './css/SignUp.module.css';

const PairingLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const history = useHistory();
    const { configuration, deviceAdapter } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;
    const limitedFeatures = useLimitedFeatures();

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const { error, isLoading, languages } = useGetLearnableLanguages(university, false, []);

    if (error) {
        showToast({ message: t(error.message), duration: 1000 });
    }

    const continueSignUp = async (selectedLanguage: Language) => {
        updateProfileSignUp({ learningLanguage: selectedLanguage, isSuggested: false });

        return history.push(`/pairing/pedagogy`);
    };

    const navigateToHome = () => {
        return history.push(limitedFeatures ? '/learning' : '/home');
    };

    const otherLanguages = () => {
        return history.push(`/pairing/other-languages`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            goBackPressed={navigateToHome}
            headerColor={configuration.secondaryColor}
            headerPercentage={12}
            headerTitle={t('global.pairing_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <LearnableLanguagesContent
                    abortStep={navigateToHome}
                    isLoading={isLoading}
                    languages={languages}
                    navigateToOtherLanguages={otherLanguages}
                    nextStep={continueSignUp}
                    university={university}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLanguagesPage;
