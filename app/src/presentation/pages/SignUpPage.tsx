import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Country from '../../domain/entities/Country';
import University from '../../domain/entities/University';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import ErrorMessage from '../components/ErrorMessage';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { Capacitor } from '@capacitor/core';
import { SignUpInformationsParams } from './SignUpInformationsPage';
import { Keyboard } from '@capacitor/keyboard';

interface SignUpPageParams {
    fromIdp: boolean;
}

const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllCountries, getInitialUrlUsecase, retrievePerson } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [showToast] = useIonToast();
    const history = useHistory();
    const location = useLocation<SignUpPageParams>();
    const { fromIdp } = location.state || {};
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [countries, setCountries] = useState<DropDownItem<Country>[]>([]);
    const [country, setCountry] = useState<Country>();
    const [department, setDepartment] = useState<string>('');
    const [diploma, setDiploma] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<Role>();
    const [staffFunction, setStaffFunction] = useState<string>('');
    const [university, setUniversity] = useState<University>();
    const [displayError, setDisplayError] = useState<boolean>(false);
    const [payload, setPayload] = useState<SignUpInformationsParams>({});

    const isAFieldEmpty: boolean =
        !university ||
        !country ||
        !selectedRole ||
        (!department && university.isCentral) ||
        (!diploma && selectedRole === 'STUDENT' && university.isCentral) ||
        (!staffFunction && selectedRole === 'STAFF' && university.isCentral);

    // Force oauth if user is not logged in and university is central.
    // Should be part of the university entity with list of awailable / required auth providers (sso, email, etc.)
    // to be more modular.
    const isFormValid: boolean = university?.isCentral ?? false ? isLoggedIn && !isAFieldEmpty : !isAFieldEmpty;

    // Map list of University to list of DropDownItem.
    const universities: DropDownItem<University>[] = (country?.universities || []).map((university) => ({
        label: university.name,
        value: university,
    }));

    // Get list of countries from API and map it to list of DropDownItem.
    const loadCountryList = async () => {
        const countriesResult = await getAllCountries.execute();

        if (countriesResult instanceof Error) {
            return await showToast({ message: t(countriesResult.message), duration: 1000 });
        }

        return setCountries(
            countriesResult.map((country) => ({
                label: `${country.emoji ? country.emoji + ' ' : ''}${country.name}`,
                value: country,
            }))
        );
    };

    // Validate university admission dates and continue to next page.
    const continueSignUp = async () => {
        if (isAFieldEmpty) {
            return await showToast({ message: t('signup_page.missing_field'), duration: 3000 });
        }
        const now = new Date();
        if (university!.admissionEnd < now || university!.admissionStart > now) {
            return setDisplayError(true);
        }

        updateProfileSignUp({ country, department, diplome: diploma, role: selectedRole, staffFunction, university });
        return history.push('/signup/informations', payload);
    };

    // Update country selection and set university to first university find in the list.
    const onCountrySelected = (country: Country) => {
        setCountry(country);
        return setUniversity(country.universities[0]);
    };

    // Get user infos and update fields when user is logged in.
    // Here we call the API to get user infos but we should call the userinfo endpoint
    // from the auth provider ?
    const getPersonInfos = async () => {
        const result = await retrievePerson.execute();
        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }
        let centralUniversity: University | undefined;
        let centralCountry: Country | undefined;
        for (const country of countries) {
            centralUniversity = country.value.universities.find((university) => university.isCentral);
            centralCountry = country.value;
            if (centralUniversity) {
                break;
            }
        }

        if (profileSignUp.staffFunction) {
            setStaffFunction(profileSignUp.staffFunction);
        }

        if (result.departement) {
            setDepartment(result.departement);
        } else if (profileSignUp.department) {
            setDepartment(profileSignUp.department);
        }

        if (profileSignUp.role) {
            setSelectedRole(profileSignUp.role);
        }

        if (result.diploma) {
            setDiploma(result.diploma);
        } else if (profileSignUp.diplome) {
            setDiploma(profileSignUp.diplome);
        }

        setUniversity(centralUniversity);
        setCountry(centralCountry);
        setPayload({
            centralFirstname: result.firstname,
            centralLastname: result.lastname,
            centralAge: result.age,
            centralEmail: result.email,
            centralGender: result.gender as Gender,
            fromIdp: true,
        });
        setIsLoggedIn(true);
    };

    useEffect(() => {
        loadCountryList();
    }, []);

    useEffect(() => {
        if (fromIdp && countries.length) {
            Keyboard.hide();
            getPersonInfos();
        }
    }, [fromIdp, countries]);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={12}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_page.title')}</h1>

                {/* Role selectors */}
                <h2 className={styles.subtitle}>{t('signup_page.profile_title')}</h2>
                <RadioButton
                    isSelected={selectedRole === 'STUDENT'}
                    onPressed={() => setSelectedRole('STUDENT')}
                    name={t('signup_page.student_role')}
                />
                <RadioButton
                    isSelected={selectedRole === 'STAFF'}
                    onPressed={() => setSelectedRole('STAFF')}
                    name={t('signup_page.staff_role')}
                />
                {(!university || !isLoggedIn) && (
                    <>
                        {/* Country selector */}
                        <div className="large-margin-top">
                            <Dropdown<Country>
                                onChange={onCountrySelected}
                                options={countries}
                                placeholder={country?.name || t('signup_page.country_placeholder')}
                                title={t('global.country')}
                            />
                        </div>
                        {/* University selector */}
                        {universities.length > 0 && (
                            <div className="large-margin-top">
                                <Dropdown<University>
                                    onChange={setUniversity}
                                    options={universities}
                                    title={t('signup_page.university_title')}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Loggin button */}
                {university && university.isCentral && !isLoggedIn && (
                    <button
                        className="tertiary-button large-margin-vertical"
                        onClick={async () => {
                            updateProfileSignUp({
                                country,
                                department,
                                role: selectedRole,
                                university,
                                diplome: diploma,
                                staffFunction,
                            });
                            const redirectUri = encodeURIComponent(
                                Capacitor.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`
                            );
                            window.location.href = getInitialUrlUsecase.execute(redirectUri);
                        }}
                    >
                        {t('signup_page.sso_button')}
                    </button>
                )}
                {/* Department selector. */}
                {university && selectedRole && (
                    <div className="large-margin-top">
                        <TextInput
                            onChange={setDepartment}
                            title={t('signup_page.department_title')}
                            value={department}
                            maxLength={50}
                        />
                    </div>
                )}
                {/* Staff function selector */}
                {university && selectedRole === 'STAFF' && (
                    <TextInput
                        onChange={setStaffFunction}
                        title={t('signup_page.function_title')}
                        value={staffFunction}
                        maxLength={50}
                    />
                )}
                {/* diploma selector */}
                {university && selectedRole === 'STUDENT' && (
                    <TextInput
                        onChange={setDiploma}
                        title={t('signup_page.diplome_title')}
                        value={diploma}
                        maxLength={50}
                    />
                )}

                {displayError && <ErrorMessage description={t('signup_page.error')} />}

                {/* continue action button */}
                <div className={styles['bottom-container']}>
                    {!selectedRole && (
                        <p className={styles.information}>
                            {`${t('signup_page.footer_university')}${configuration.mainUniversityName} ? ${t(
                                'signup_page.footer_email'
                            )} `}
                            <a href={`mailto:${configuration.emailContact}`}>{configuration.emailContact}</a>
                        </p>
                    )}
                    <button
                        className={`primary-button ${!isFormValid ? 'disabled' : ''}`}
                        disabled={!isFormValid}
                        onClick={continueSignUp}
                    >
                        {t('signup_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpPage;
