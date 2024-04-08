import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import SuccessLayout from '../components/layout/SuccessLayout';
import styles from './css/SignUpFinalPage.module.css';
import { useIonToast } from '@ionic/react';
import Avatar from '../components/Avatar';
import { useHistory } from 'react-router';

const SignupFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { configuration, createProfile, editProfile } = useConfig();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const user = useStoreState((state) => state.user);
    const isUpdate = profile?.id;

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

        return history.push('/home');
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
                    profile?.user.firstname.trim() || user?.firstname.trim()
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
