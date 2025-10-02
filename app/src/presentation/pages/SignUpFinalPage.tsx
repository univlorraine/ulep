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
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import Avatar from '../components/Avatar';
import SuccessLayout from '../components/layout/SuccessLayout';
import useLimitedFeatures from '../hooks/useLimitedFeatures';
import styles from './css/SignUpFinalPage.module.css';

const SignupFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { configuration, createProfile, editProfile } = useConfig();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const user = useStoreState((state) => state.user);
    const isUpdate = Boolean(profile?.id);
    const limitedFeatures = useLimitedFeatures();

    const onCreateProfile = async () => {
        if (
            !profileSignUp.nativeLanguage ||
            !profileSignUp.otherLanguages ||
            !profileSignUp.goals ||
            !profileSignUp.frequency ||
            !profileSignUp.interests ||
            !profileSignUp.biography ||
            !profileSignUp.availabilities
        ) {
            // If we have a profile and no profileSignUp, we must go to next step to add languages
            if (profile?.id) {
                return history.push('/pairing/languages');
            }

            return await showToast({ message: t('errors.global'), duration: 1000 });
        }
        const result = await createProfile.execute(
            profileSignUp.nativeLanguage.code,
            profileSignUp.otherLanguages.map((otherLanguage) => otherLanguage.code),
            profileSignUp.goals.map((goal) => goal.id),
            profileSignUp.frequency,
            profileSignUp.interests,
            profileSignUp.biography,
            profileSignUp.availabilities,
            profileSignUp.availabilityNote,
            profileSignUp.availabilityNotePrivate
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return history.push('/pairing/languages');
    };

    const onUpdateProfile = async () => {
        if (!profile) {
            return await showToast({ message: t('errors.global'), duration: 1000 });
        }

        const result = await editProfile.execute(profile.id, profileSignUp);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return history.push(limitedFeatures ? '/learning' : '/home');
    };

    const nextStep = async () => {
        if (isUpdate) {
            return await onUpdateProfile();
        }

        return await onCreateProfile();
    };

    return (
        <SuccessLayout
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            backgroundColorCode={configuration.primaryDarkColor}
            colorCode={configuration.primaryColor}
        >
            <div className={styles.container}>
                <h1 className={styles.title}>{`${t('signup_end_page.thanks')} ${
                    user?.firstname.trim() || profile?.user.firstname.trim()
                }, ${t('signup_end_page.account')}`}</h1>
                <Avatar user={user} className={styles.image} />
                {!isUpdate ? (
                    <p className={styles.description}>{t('signup_end_page.description')}</p>
                ) : (
                    <div className="margin" />
                )}
                <button
                    aria-label={t('signup_end_page.validate_button') as string}
                    className="primary-button"
                    onClick={nextStep}
                >
                    {t('signup_end_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default SignupFinalPage;
