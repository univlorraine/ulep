import { IonRadio, IonRadioGroup, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { isEmailCorrect, isNameCorrect } from '../utils';
import styles from './css/SignUp.module.css';
import { PlusPng } from '../../assets';
import { useHistory } from 'react-router';
import NetworkImage from '../components/NetworkImage';

const EditInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { editUser, cameraAdapter, configuration } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);

    const [email, setEmail] = useState<string>(profile?.user ? profile!.user.email : '');
    const [firstname, setFirstname] = useState<string>(profile?.user ? profile!.user.firstname : '');
    const [lastname, setLastname] = useState<string>(profile?.user ? profile!.user.lastname : '');
    const [gender, setGender] = useState<Gender | undefined>(profile?.user ? profile!.user!.gender : undefined);
    const [age, setAge] = useState<number | undefined>(profile?.user ? profile!.user!.age : undefined);
    const [profilePicture, setProfilePicture] = useState<File | undefined>();

    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () => {
        return (profile?.user.university.isCentral || email) && gender && age && firstname && lastname;
    };

    const openGallery = async () => {
        setProfilePicture(await cameraAdapter.getPictureFromGallery());
    };

    const nextStep = async () => {
        if (!profile?.user.university.isCentral && (!email || !isEmailCorrect(email))) {
            return setErrorMessage({ type: 'email', message: t('signup_informations_page.error_email') });
        }

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

        const result = await editUser.execute(
            profile!.user.id,
            age,
            email,
            firstname,
            gender,
            lastname,
            profilePicture
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 3000 });
        }

        return history.push('/signup/languages');
    };

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
                    {!profilePicture && profile?.user.avatar && (
                        <NetworkImage id={profile.user.avatar.id} className={styles.image} />
                    )}
                    {(profilePicture || !profile?.user.avatar) && (
                        <img
                            alt=""
                            className={styles.image}
                            src={profilePicture ? URL.createObjectURL(profilePicture) : PlusPng}
                        />
                    )}
                    <p>
                        {t(
                            profilePicture || profile?.user.avatar
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

                    <IonRadioGroup value={gender} onIonChange={(ev) => setGender(ev.detail.value)}>
                        <IonRadio labelPlacement="end" value="FEMALE">
                            {t('global.woman')}
                        </IonRadio>
                        <br />
                        <IonRadio labelPlacement="end" value="MALE">
                            {t('global.men')}
                        </IonRadio>
                        <br />
                        <IonRadio labelPlacement="end" value="OTHER">
                            {t('global.binary')}
                        </IonRadio>
                    </IonRadioGroup>
                </div>

                <TextInput
                    errorMessage={errorMessage?.type === 'age' ? errorMessage.message : undefined}
                    onChange={(age: string) => setAge(Number(age))}
                    placeholder={t('signup_informations_page.placeholder_age')}
                    title={t('global.age')}
                    type="text"
                    value={age ? `${age}` : ''}
                />

                {!profile?.user.university.isCentral && (
                    <TextInput
                        autocomplete="email"
                        errorMessage={errorMessage?.type === 'email' ? errorMessage.message : undefined}
                        onChange={setEmail}
                        placeholder={t('signup_informations_page.placeholder_email')}
                        title={t('global.email')}
                        type="email"
                        value={email}
                    />
                )}

                <div className={styles['bottom-container']}>
                    <button
                        className={`primary-button small-margin-top large-margin-bottom ${
                            !allFieldHasValue() ? 'disabled' : ''
                        }`}
                        disabled={!allFieldHasValue()}
                        onClick={nextStep}
                    >
                        {t('signup_informations_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default EditInformationsPage;
