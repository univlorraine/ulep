import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/layout/SuccessLayout';
import { codeLanguageToFlag } from '../utils';
import styles from './css/PairingFinalPage.module.css';
import { useState } from 'react';
import Avatar from '../components/Avatar';

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
