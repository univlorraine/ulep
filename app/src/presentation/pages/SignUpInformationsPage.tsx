import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import Checkbox from '../components/Checkbox';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/WebLayoutCentered';
import { isEmailCorrect, isNameCorrect, isPasswordCorrect } from '../utils';
import styles from './css/SignUp.module.css';

const SignUpInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [gender, setGender] = useState<Gender>();
    const [age, setAge] = useState<number>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string>();
    const [CGUChecked, setCGUChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () =>
        !email ||
        !password ||
        !confirmPassword ||
        !gender ||
        !age ||
        !firstname ||
        !lastname ||
        !profilePicture ||
        !CGUChecked;

    const openGallery = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
        });

        if (image.webPath) {
            setProfilePicture(image.webPath);
        }
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

        if (!age) {
            return setErrorMessage({ type: 'age', message: t('signup_informations_page.error_age') });
        }

        if (!email || !isEmailCorrect(email)) {
            return setErrorMessage({ type: 'email', message: t('signup_informations_page.error_email') });
        }

        if (!password || !isPasswordCorrect(password)) {
            return setErrorMessage({ type: 'password', message: t('signup_informations_page.error_password') });
        }

        if (password !== confirmPassword) {
            return setErrorMessage({ type: 'confirm', message: t('signup_informations_page.error_confirm_password') });
        }

        updateProfileSignUp({ firstname, lastname, gender, age, email, password, profilePicture });

        return history.push('/signup/languages');
    };

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
                    <img alt="plus" className={styles.image} src={profilePicture ?? 'assets/plus.svg'} />
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

                <div className="margin-top">
                    <TextInput
                        errorMessage={errorMessage?.type === 'age' ? errorMessage.message : undefined}
                        onChange={(age: string) => setAge(Number(age))}
                        placeholder={t('signup_informations_page.placeholder_age')}
                        title={t('global.age')}
                        type="text"
                        value={age ? `${age}` : ''}
                    />
                </div>

                <TextInput
                    errorMessage={errorMessage?.type === 'email' ? errorMessage.message : undefined}
                    onChange={setEmail}
                    placeholder={t('signup_informations_page.placeholder_email')}
                    title={t('global.email')}
                    type="email"
                    value={email}
                />

                <TextInput
                    errorMessage={errorMessage?.type === 'password' ? errorMessage.message : undefined}
                    onChange={setPassword}
                    placeholder={t('signup_informations_page.placeholder_password')}
                    title={t('global.password')}
                    type="password"
                    value={password}
                />

                <TextInput
                    errorMessage={errorMessage?.type === 'confirm' ? errorMessage.message : undefined}
                    onChange={setConfirmPassword}
                    placeholder={t('signup_informations_page.placeholder_confirm_password')}
                    title={t('signup_informations_page.confirm_password')}
                    type="password"
                    value={confirmPassword}
                />

                <Checkbox
                    isSelected={CGUChecked}
                    onPressed={() => setCGUChecked(!CGUChecked)}
                    name={t('signup_informations_page.cgu')}
                />

                <div className={styles['bottom-container']}>
                    <button
                        className={`primary-button small-margin-top large-margin-bottom ${
                            allFieldHasValue() ? 'disabled' : ''
                        }`}
                        disabled={allFieldHasValue()}
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
