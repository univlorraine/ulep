import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import SuccessLayout from '../components/layout/SuccessLayout';
import { codeCountryToFlag } from '../utils';
import styles from './css/PairingFinalPage.module.css';

const PairingFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { configuration, createProfile } = useConfig();
    const [showToast] = useIonToast();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const user = useStoreState((state) => state.user);

    if (!profileSignUp.learningLanguage || !profileSignUp.university || !user) {
        return <Redirect to="/signup/pairing/languages" />;
    }

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
            !profileSignUp.goals ||
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
            profileSignUp.goals.map((goal) => goal.id),
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

        return history.replace('/home');
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
                } ${codeCountryToFlag(profileSignUp.learningLanguage.code)}`}</div>
                <span className={`${styles.description} large-margin-top`}>{`${t(
                    'pairing_final_page.congratulation'
                )},`}</span>
                <span className={styles.description}>{t('pairing_final_page.congratulation_text')}</span>
                <button className="primary-button large-margin-top" onClick={nextStep}>
                    {t('pairing_final_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default PairingFinalPage;
