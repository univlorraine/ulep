import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/layout/SuccessLayout';
import { codeLanguageToFlag } from '../utils';
import styles from './css/PairingFinalPage.module.css';

const PairingFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const { askForLearningLanguage, configuration, createProfile } = useConfig();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const updateProfile = useStoreActions((state) => state.updateProfile);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const userSignIn = useStoreState((state) => state.user);
    const user = userSignIn || profile?.user;
    const university = profileSignUp.university || user?.university;

    if (!profileSignUp.learningLanguage || !university || !user) {
        return <Redirect to={`${isSignUp ? '/' + isSignUp : '/'}pairing/languages`} />;
    }

    const askNewLanguage = async () => {
        if (!profileSignUp.learningLanguage || !profileSignUp.learningLanguageLevel) {
            return await showToast({ message: t('errors.global'), duration: 1000 });
        }

        const result = await askForLearningLanguage.execute(
            profile!.id,
            profileSignUp.learningLanguage,
            profileSignUp.learningLanguageLevel
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        updateProfile({ learningLanguage: result });
        return (window.location.href = '/home');
    };

    const nextStep = async () => {
        if (
            !profileSignUp.age ||
            !profileSignUp.role ||
            !profileSignUp.gender ||
            !profileSignUp.university ||
            !profileSignUp.nativeLanguage ||
            !profileSignUp.otherLanguages ||
            !profileSignUp.learningLanguage ||
            !profileSignUp.learningLanguageLevel ||
            !profileSignUp.pedagogy ||
            !profileSignUp.frequency ||
            !profileSignUp.interests ||
            !profileSignUp.biography
        ) {
            return await showToast({ message: t('errors.global'), duration: 1000 });
        }

        const result = await createProfile.execute(
            profileSignUp.nativeLanguage.code,
            profileSignUp.otherLanguages.map((language) => language.code),
            profileSignUp.learningLanguage.code,
            profileSignUp.learningLanguageLevel,
            profileSignUp.pedagogy,
            profileSignUp.goals?.map((goal) => goal.id) || [],
            profileSignUp.frequency,
            profileSignUp.interests,
            !!profileSignUp.sameAge,
            !!profileSignUp.sameGender,
            profileSignUp.biography,
            !!profileSignUp.isForCertificate,
            !!profileSignUp.isForProgram,
            profileSignUp.campus?.id
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }
        return (window.location.href = '/home');
    };

    return (
        <SuccessLayout
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            backgroundColorCode={configuration.secondaryDarkColor}
            colorCode={configuration.secondaryColor}
        >
            <div className={styles.container}>
                <h1 className="title">{t('pairing_final_page.title')}</h1>
                <div className={styles['image-container']}>
                    <img className={styles.image} alt="avatar" src={user.avatar}></img>
                    <div className={styles.bubble}>
                        <FlagBubble language={profileSignUp.learningLanguage} textColor="white" isSelected disabled />
                    </div>
                </div>
                <div className={`${styles['tandem-container']}`}>{`${t('global.tandem')} ${
                    profileSignUp.learningLanguage.name
                } ${codeLanguageToFlag(profileSignUp.learningLanguage.code)}`}</div>
                <span className={`${styles.description} large-margin-top`}>{`${t(
                    'pairing_final_page.congratulation'
                )},`}</span>
                <span className={styles.description}>{t('pairing_final_page.congratulation_text')}</span>
                <button
                    className="primary-button large-margin-top"
                    onClick={() => (isSignUp ? nextStep() : askNewLanguage())}
                >
                    {t('pairing_final_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default PairingFinalPage;
