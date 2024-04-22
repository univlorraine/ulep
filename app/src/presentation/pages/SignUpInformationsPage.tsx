import { IonPopover, useIonPopover, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { InfoSvg, PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import Checkbox from '../components/Checkbox';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { isEmailCorrect, isNameCorrect } from '../utils';
import styles from './css/SignUp.module.css';

export interface SignUpInformationsParams {
    centralFirstname?: string;
    centralLastname?: string;
    centralEmail?: string;
    centralGender?: Gender;
    centralAge?: number;
    fromIdp?: boolean;
}

const PasswordInfo = () => {
    const { t } = useTranslation();
    const rules: string[] = t('signup_informations_page.password_infos.rules', { returnObjects: true }) || [];

    return (
        <>
            <button
                id="password-info"
                className={styles['password-infos-btn']}
                aria-label={t('signup_informations_page.password_infos.btn') as string}
            >
                <img src={InfoSvg} alt={t('signup_informations_page.password_infos.btn') as string} />
            </button>
            <IonPopover
                trigger="password-info"
                side="bottom"
                alignment="center"
                size="cover"
                className={styles['password-infos-popover']}
            >
                <div className={styles['password-infos']}>
                    <img src={InfoSvg} alt={t('signup_informations_page.password_infos.btn') as string} />
                    {Array.isArray(rules) && (
                        <div className={styles['password-infos-rules']}>
                            <span>{t('signup_informations_page.password_infos.title')}</span>
                            <ul>{Array.isArray(rules) && rules.map((rule, index) => <li key={index}>{rule}</li>)}</ul>
                        </div>
                    )}
                </div>
            </IonPopover>
        </>
    );
};

const SignUpInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { browserAdapter, cameraAdapter, configuration, createUser } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const location = useLocation<SignUpInformationsParams>();
    const { fromIdp } = location.state || {};
    const profileSignUp = useStoreState((store) => store.profileSignUp);
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [gender, setGender] = useState<Gender | undefined>();
    const [age, setAge] = useState<number | undefined>();
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | undefined>();
    const [CGUChecked, setCGUChecked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () => {
        return (
            email &&
            gender &&
            age &&
            firstname &&
            lastname &&
            CGUChecked &&
            (fromIdp ? true : password && confirmPassword)
        );
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

        if (!age || age < 17 || age > 80) {
            return setErrorMessage({ type: 'age', message: t('signup_informations_page.error_age') });
        }

        if (!email || !isEmailCorrect(email)) {
            return setErrorMessage({ type: 'email', message: t('signup_informations_page.error_email') });
        }

        if (!profileSignUp.university || !profileSignUp.country || !profileSignUp.role) {
            await showToast({ message: t('errors.global'), duration: 1000 });
            return history.push('/signup/');
        }

        if (!fromIdp && !password) {
            return setErrorMessage({ type: 'password', message: t('signup_informations_page.error_password') });
        }

        if (!fromIdp && password !== confirmPassword) {
            return setErrorMessage({ type: 'confirm', message: t('signup_informations_page.error_confirm_password') });
        }

        const result = await createUser.execute(
            email,
            password,
            firstname,
            lastname,
            gender,
            code.trim(),
            age,
            profileSignUp.university,
            profileSignUp.role,
            profileSignUp.country.code,
            profileSignUp.department,
            profileSignUp.diplome,
            profileSignUp.staffFunction,
            profilePicture
        );

        if (result instanceof Error) {
            if (result.message === 'signup_informations_page.error_domain') {
                return setErrorMessage({ type: 'email', message: t(result.message) });
            }

            if (result.message === 'signup_informations_page.error_code') {
                return setErrorMessage({ type: 'code', message: t(result.message) });
            }

            if (result.message === 'signup_informations_page.password_error') {
                return setErrorMessage({ type: 'password', message: t(result.message) });
            }

            return await showToast({ message: t(result.message), duration: 3000 });
        }

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

    useEffect(() => {
        const state = location.state;
        if (state) {
            setEmail(state.centralEmail || '');
            setFirstname(state.centralFirstname || '');
            setLastname(state.centralLastname || '');
            setGender(state.centralGender);
            setAge(state.centralAge);
        }
    }, [location.state]);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={24}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_informations_page.title')}</h1>

                <button
                    aria-label={
                        t(
                            profilePicture
                                ? 'signup_informations_page.photo_selected'
                                : 'signup_informations_page.photo'
                        ) as string
                    }
                    className="secondary-button"
                    onClick={() => openGallery()}
                >
                    <img
                        alt=""
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

                <TextInput
                    autocomplete="email"
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

                {!fromIdp && (
                    <>
                        <TextInput
                            autocomplete="new-password"
                            errorMessage={errorMessage?.type === 'password' ? errorMessage.message : undefined}
                            onChange={setPassword}
                            placeholder={t('signup_informations_page.placeholder_password')}
                            title={t('global.password')}
                            type="password"
                            value={password}
                            fieldInfo={<PasswordInfo />}
                        />
                        <TextInput
                            autocomplete="new-password"
                            errorMessage={errorMessage?.type === 'confirm' ? errorMessage.message : undefined}
                            onChange={setConfirmPassword}
                            placeholder={t('signup_informations_page.placeholder_confirm_password')}
                            title={t('signup_informations_page.confirm_password')}
                            type="password"
                            value={confirmPassword}
                        />
                    </>
                )}

                <Checkbox
                    isSelected={CGUChecked}
                    onPressed={() => setCGUChecked(!CGUChecked)}
                    name={
                        <>
                            {`${t('signup_informations_page.cgu.prefix')} `}
                            <a href={configuration.cguUrl} onClick={browserAdapter.openLinkInBrowser}>{`${t(
                                'signup_informations_page.cgu.cgu'
                            )}`}</a>
                            {` ${t('signup_informations_page.cgu.separator')} `}
                            <a href={configuration.confidentialityUrl} onClick={browserAdapter.openLinkInBrowser}>{`${t(
                                'signup_informations_page.cgu.confidentiality'
                            )}`}</a>
                            {` ${t('signup_informations_page.cgu.suffix')}`}
                        </>
                    }
                />

                <div className={styles['bottom-container']}>
                    <button
                        aria-label={t('signup_informations_page.validate_button') as string}
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
