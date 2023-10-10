import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import Checkbox from '../components/Checkbox';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { isEmailCorrect, isNameCorrect, isPasswordCorrect } from '../utils';
import styles from './css/SignUp.module.css';

interface SignUpInformationsParams {
    centralFirstname?: string;
    centralLastname?: string;
    centralEmail?: string;
    centralGender?: Gender;
    centralAge?: number;
}

const SignUpInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { cameraAdapter, configuration, createUser } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const location = useLocation<SignUpInformationsParams>();
    const { centralFirstname, centralLastname, centralEmail, centralGender, centralAge } = location.state || {};
    const profileSignUp = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [firstname, setFirstname] = useState<string>(centralFirstname || '');
    const [lastname, setLastname] = useState<string>(centralLastname || '');
    const [gender, setGender] = useState<Gender | undefined>(centralGender);
    const [age, setAge] = useState<number | undefined>(centralAge);
    const [email, setEmail] = useState<string>(centralEmail || '');
    const [code, setCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | undefined>();
    const [CGUChecked, setCGUChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () => {
        if (centralLastname) {
          return email && gender && age && firstname && lastname && CGUChecked;
        } else {
          return email && password && confirmPassword && gender && age && firstname && lastname && CGUChecked;
        }
      };


    const openGallery = async () => {
        setProfilePicture(await cameraAdapter.getPictureFromGallery());
    };

    const continueSignUp = async () => {
        if (!firstname || !isNameCorrect(firstname)) {
            return setErrorMessage({ type: 'firstname', message: t('signup_informations_page.error_firstname') });
        }

        if (!lastname || !isNameCorrect(lastname)) {
            return setErrorMessage({ type: 'lastname', message: t('signup_informations_page.error_lastname') });
        }

        if (!gender) {
            return await showToast(t('signup_informations_page.error_gender'), 1000);
        }

        if (!age || age < 1 || age > 80) {
            return setErrorMessage({ type: 'age', message: t('signup_informations_page.error_age') });
        }

        if (!email || !isEmailCorrect(email)) {
            return setErrorMessage({ type: 'email', message: t('signup_informations_page.error_email') });
        }

        if (!profileSignUp.university || !profileSignUp.country || !profileSignUp.role) {
            await showToast({ message: t('errors.global'), duration: 1000 });
            return history.push('/signup/');
        }

        if (!centralLastname && (!password || !isPasswordCorrect(password))) {
            return setErrorMessage({ type: 'password', message: t('signup_informations_page.error_password') });
        }

        if (centralLastname && password !== confirmPassword) {
            return setErrorMessage({ type: 'confirm', message: t('signup_informations_page.error_confirm_password') });
        }

        const result = await createUser.execute(
            email,
            password,
            firstname,
            lastname,
            gender,
            code,
            age,
            profileSignUp.university,
            profileSignUp.role,
            profileSignUp.country.code,
            profilePicture
        );

        if (result instanceof Error) {
            if (result.message === 'signup_informations_page.error_domain') {
                return setErrorMessage({ type: 'email', message: t(result.message) });
            }

            if (result.message === 'signup_informations_page.error_code') {
                return setErrorMessage({ type: 'code', message: t(result.message) });
            }

            return await showToast({ message: t(result.message), duration: 3000 });
        }

        updateProfileSignUp({
            firstname,
            lastname,
            gender,
            age,
            email,
            password,
            profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : undefined,
        });

        return history.push('/signup/languages');
    };

    const userUlAutomaticValues = async () => {
        setFirstname(profileSignUp.firstname || '');
        setLastname(profileSignUp.lastname || '');
        setGender(profileSignUp.gender || undefined);
        setAge(profileSignUp.age || undefined);
        setEmail(profileSignUp.email || '');
    };

    useEffect(() => {
        if (profileSignUp.university?.isCentral) {
            userUlAutomaticValues();
        }
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={24}
            headerTitle={t('global.create_account_title')}
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
                    errorMessage={errorMessage?.type === 'firstname' ? errorMessage.message : undefined}
                    onChange={setFirstname}
                    placeholder={t('signup_informations_page.placeholder_firstname')}
                    title={t('global.firstname')}
                    type="text"
                    value={firstname}
                />

                <TextInput
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
                        isSelected={gender === 'female'}
                        onPressed={() => setGender('female')}
                        name={t('global.woman')}
                    />

                    <RadioButton
                        isSelected={gender === 'male'}
                        onPressed={() => setGender('male')}
                        name={t('global.men')}
                    />

                    <RadioButton
                        isSelected={gender === 'other'}
                        onPressed={() => setGender('other')}
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

                <TextInput
                    errorMessage={errorMessage?.type === 'email' ? errorMessage.message : undefined}
                    onChange={setEmail}
                    placeholder={t('signup_informations_page.placeholder_email')}
                    title={t('global.email')}
                    type="email"
                    value={email}
                />

                {profileSignUp.university?.hasCode && (
                    <TextInput
                        errorMessage={errorMessage?.type === 'code' ? errorMessage.message : undefined}
                        onChange={setCode}
                        placeholder={t('signup_informations_page.placeholder_code')}
                        title={t('signup_informations_page.code')}
                        type="text"
                        value={code}
                    />
                )}

                {!centralLastname && <TextInput
                    errorMessage={errorMessage?.type === 'password' ? errorMessage.message : undefined}
                    onChange={setPassword}
                    placeholder={t('signup_informations_page.placeholder_password')}
                    title={t('global.password')}
                    type="password"
                    value={password}
                />}

                {!centralLastname && <TextInput
                    errorMessage={errorMessage?.type === 'confirm' ? errorMessage.message : undefined}
                    onChange={setConfirmPassword}
                    placeholder={t('signup_informations_page.placeholder_confirm_password')}
                    title={t('signup_informations_page.confirm_password')}
                    type="password"
                    value={confirmPassword}
                />}

                <Checkbox
                    isSelected={CGUChecked}
                    onPressed={() => setCGUChecked(!CGUChecked)}
                    name={t('signup_informations_page.cgu')}
                />

                <div className={styles['bottom-container']}>
                    <button
                        className={`primary-button small-margin-top large-margin-bottom ${
                            !allFieldHasValue() ? 'disabled' : ''
                        }`}
                        disabled={!allFieldHasValue()}
                        onClick={continueSignUp}
                    >
                        {t('signup_informations_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpInformationsPage;
