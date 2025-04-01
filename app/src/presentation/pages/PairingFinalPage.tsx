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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import Avatar from '../components/Avatar';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/layout/SuccessLayout';
import { codeLanguageToFlag } from '../utils';
import styles from './css/PairingFinalPage.module.css';

const PairingFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { askForLearningLanguage, configuration } = useConfig();
    const [showToast] = useIonToast();
    const [loading, setLoading] = useState<boolean>(false);
    const profile = useStoreState((state) => state.profile);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const userSignIn = useStoreState((state) => state.user);
    const user = profile?.user || userSignIn;
    const university = user?.university;

    if ((!profileSignUp.learningLanguage && !loading) || !university || !user) {
        return <Redirect to={`/pairing/languages`} />;
    }

    const askNewLanguage = async () => {
        setLoading(true);
        if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel || !profileSignUp.pedagogy) {
            return await showToast({ message: t('errors.global'), duration: 1000 });
        }
        const result = await askForLearningLanguage.execute(
            profile!.id,
            profileSignUp.learningLanguage,
            profileSignUp.learningLanguageLevel,
            profileSignUp.pedagogy,
            Boolean(profileSignUp.sameAge),
            Boolean(profileSignUp.sameGender),
            Boolean(profileSignUp.sameTandem),
            profileSignUp.campus?.id,
            Boolean(profileSignUp.isForCertificate),
            Boolean(profileSignUp.isForProgram)
        );

        if (result instanceof Error) {
            setLoading(false);
            await showToast({ message: t(result.message), duration: 1000 });
            return;
        }

        updateProfile({ learningLanguage: result });
        history.push('/home');
    };

    if (profileSignUp.learningLanguage === undefined) {
        return null;
    }

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.container}>
                <h1 className="title">{t('pairing_final_page.title')}</h1>
                <div className={styles['image-container']}>
                    <Avatar user={user} className={styles.image} />
                    <div className={styles.bubble}>
                        <FlagBubble language={profileSignUp.learningLanguage!} textColor="white" isSelected disabled />
                    </div>
                </div>
                <div className={`${styles['tandem-container']}`}>{`${t('global.tandem')} ${t(
                    `languages_code.${profileSignUp.learningLanguage!.code}`
                )} ${codeLanguageToFlag(profileSignUp.learningLanguage!.code)}`}</div>
                <span className={`${styles.description} large-margin-top`}>{`${t(
                    'pairing_final_page.congratulation'
                )},`}</span>
                <span className={styles.description}>{t('pairing_final_page.congratulation_text')}</span>
                <button
                    aria-label={t('pairing_final_page.validate_button') as string}
                    className="primary-button large-margin-top"
                    disabled={loading}
                    onClick={askNewLanguage}
                >
                    {t('pairing_final_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default PairingFinalPage;
