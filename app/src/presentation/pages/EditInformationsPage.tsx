import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { isNameCorrect } from '../utils';
import styles from './css/SignUp.module.css';
import { PlusPng } from '../../assets';
import { useHistory } from 'react-router';

const EditInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { cameraAdapter, configuration, editUser } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const user = useStoreState((state) => state.user);
    const profile = useStoreState((state) => state.profile);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [firstname, setFirstname] = useState<string>(profile?.user ? profile!.user.firstname : '');
    const [lastname, setLastname] = useState<string>(profile?.user ? profile!.user.lastname : '');
    const [gender, setGender] = useState<Gender | undefined>(profile?.user ? profile!.user!.gender : undefined);
    const [age, setAge] = useState<number | undefined>(profile?.user ? profile!.user!.age : undefined);
    const [profilePicture, setProfilePicture] = useState<File | undefined>();

    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () => {
        return gender && age && firstname && lastname;
    };

    const openGallery = async () => {
        setProfilePicture(await cameraAdapter.getPictureFromGallery());
    };

    const editProfile = async () => {
        if (!firstname || !isNameCorrect(firstname)) {
            return setErrorMessage({ type: 'firstname', message: t('signup_informations_page.error_firstname') });
        }

        if (!lastname || !isNameCorrect(lastname)) {
            return setErrorMessage({ type: 'lastname', message: t('signup_informations_page.error_lastname') });
        }

        if (!gender) {
            return await showToast(t('signup_informations_page.error_gender'), 1000);
        }

        if (!age || age < 17 || age > 80) {
            return setErrorMessage({ type: 'age', message: t('signup_informations_page.error_age') });
        }

        const userId = profile?.user.id;

        if (!userId) return;

        const result = await editUser.execute(userId, firstname, lastname, gender, age);

        if (result instanceof Error) {
            if (result.message === 'signup_informations_page.error_domain') {
                return setErrorMessage({ type: 'email', message: t(result.message) });
            }

            if (result.message === 'signup_informations_page.error_code') {
                return setErrorMessage({ type: 'code', message: t(result.message) });
            }
            return await showToast({ message: t(result.message), duration: 3000 });
        }

        console.log(profile);
        updateProfileSignUp({
            availabilities: profile.availabilities,
            availabilityNote: profile.availabilitiesNote,
            availabilityNotePrivate: profile.availabilitiesNotePrivacy,
            biography: {
                power: profile.biography.superpower,
                place: profile.biography.favoritePlace,
                travel: profile.biography.experience,
                incredible: profile.biography.anecdote,
            },
            frequency: profile.frequency,
            goals: profile.goals,
            learningLanguage: profile.learningLanguages[0],
            nativeLanguage: profile.nativeLanguage,
            otherLanguages: profile.learningLanguages,
            interests: profile.interests.map((interest) => interest.id),
            firstname,
            lastname,
            gender,
            age,
            email: profile.user.email,
            profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : undefined,
        });

        return history.push('/signup/languages');
    };

    const userUlAutomaticValues = async () => {
        setFirstname(profileEdit.firstname || '');
        setLastname(profileEdit.lastname || '');
        setGender(profileEdit.gender || undefined);
        setAge(profileEdit.age || undefined);
    };

    useEffect(() => {
        updateProfileSignUp({
            firstname: user?.firstname,
            lastname: user?.lastname,
            gender: user?.gender,
            age: user?.age,
            email: user?.email,
        });
    }, [user]);

    useEffect(() => {
        if (profileEdit.university?.isCentral) {
            userUlAutomaticValues();
        }
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={24}
            headerTitle={t('global.edit_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_informations_page.title')}</h1>

                <button className="secondary-button" onClick={() => openGallery()}>
                    <img
                        alt="plus"
                        className={styles.image}
                        src={profilePicture ? URL.createObjectURL(profilePicture) : PlusPng}
                    />
                    <p>
                        {t(
                            profilePicture
                                ? 'signup_informations_page.photo_selected'
                                : 'signup_informations_page.photo'
                        )}
                    </p>
                </button>

                <TextInput
                    autocomplete="name"
                    errorMessage={errorMessage?.type === 'firstname' ? errorMessage.message : undefined}
                    onChange={setFirstname}
                    placeholder={t('signup_informations_page.placeholder_firstname')}
                    title={t('global.firstname')}
                    type="text"
                    value={firstname}
                />

                <TextInput
                    autocomplete="family-name"
                    errorMessage={errorMessage?.type === 'lastname' ? errorMessage.message : undefined}
                    onChange={setLastname}
                    placeholder={t('signup_informations_page.placeholder_name')}
                    title={t('global.lastname')}
                    type="text"
                    value={lastname}
                />

                <div className="margin-bottom">
                    <h2 className={`${styles.subtitle} no-margin-top`}>{t('global.gender')}</h2>

                    <RadioButton
                        isSelected={gender === 'FEMALE'}
                        onPressed={() => setGender('FEMALE')}
                        name={t('global.woman')}
                    />

                    <RadioButton
                        isSelected={gender === 'MALE'}
                        onPressed={() => setGender('MALE')}
                        name={t('global.men')}
                    />

                    <RadioButton
                        isSelected={gender === 'OTHER'}
                        onPressed={() => setGender('OTHER')}
                        name={t('global.binary')}
                    />
                </div>

                <TextInput
                    errorMessage={errorMessage?.type === 'age' ? errorMessage.message : undefined}
                    onChange={(age: string) => setAge(Number(age))}
                    placeholder={t('signup_informations_page.placeholder_age')}
                    title={t('global.age')}
                    type="text"
                    value={age ? `${age}` : ''}
                />

                <div className={styles['bottom-container']}>
                    <button
                        className={`primary-button small-margin-top large-margin-bottom ${
                            !allFieldHasValue() ? 'disabled' : ''
                        }`}
                        disabled={!allFieldHasValue()}
                        onClick={editProfile}
                    >
                        {t('signup_informations_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default EditInformationsPage;
