/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Keyboard } from '@capacitor/keyboard';
import { IonRadio, IonRadioGroup, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Country from '../../domain/entities/Country';
import University from '../../domain/entities/University';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import ErrorMessage from '../components/ErrorMessage';
import RequiredField from '../components/forms/RequiredField';
import RequiredFieldsMention from '../components/forms/RequiredFieldsMention';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import TextInput from '../components/TextInput';
import styles from './css/SignUp.module.css';
import { SignUpInformationsParams } from './SignUpInformationsPage';

interface SignUpPageParams {
    fromIdp: boolean;
}

const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const { browserAdapter, deviceAdapter, configuration, getAllCountries, getInitialUrlUsecase, retrievePerson } =
        useConfig();
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
    const isFormValid: boolean = (university?.isCentral ?? false) ? isLoggedIn && !isAFieldEmpty : !isAFieldEmpty;

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
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <h1 className={styles.title}>{t('signup_page.title')}</h1>
                <RequiredFieldsMention />

                {/* Role selectors */}
                <h2 className={styles.subtitle}>
                    {t('signup_page.profile_title')} <RequiredField />
                </h2>
                <IonRadioGroup
                    value={selectedRole}
                    onIonChange={(ev) => setSelectedRole(ev.detail.value)}
                    aria-label={t('signup_page.role_aria_label') as string}
                    aria-required={true}
                >
                    <IonRadio labelPlacement="end" value="STUDENT" aria-label={t('signup_page.student_role') as string}>
                        {t('signup_page.student_role')}
                    </IonRadio>
                    <br />
                    <IonRadio labelPlacement="end" value="STAFF" aria-label={t('signup_page.staff_role') as string}>
                        {t('signup_page.staff_role')}
                    </IonRadio>
                </IonRadioGroup>
                {(!university || !isLoggedIn) && (
                    <>
                        {/* Country selector */}
                        <div className="large-margin-top">
                            <Dropdown<Country>
                                onChange={onCountrySelected}
                                options={countries}
                                placeholder={country?.name || t('signup_page.country_placeholder')}
                                title={t('global.country') as string}
                                ariaLabel={t('signup_page.country_aria_label') as string}
                                aria-required={true}
                                required={true}
                                value={
                                    country
                                        ? {
                                              label: `${country.emoji ? country.emoji + ' ' : ''}${country.name}`,
                                              value: country,
                                          }
                                        : undefined
                                }
                            />
                        </div>
                        {/* University selector */}
                        {universities.length > 0 && (
                            <div className="large-margin-top">
                                <Dropdown<University>
                                    onChange={setUniversity}
                                    options={universities}
                                    title={t('signup_page.university_title')}
                                    ariaLabel={t('signup_page.university_aria_label') as string}
                                    aria-required={true}
                                    required={true}
                                    value={university ? { label: university.name, value: university } : undefined}
                                />
                            </div>
                        )}
                    </>
                )}
                {/* Loggin button */}
                {university && university.isCentral && !isLoggedIn && (
                    <button
                        aria-label={t('signup_page.sso_button') as string}
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
                                deviceAdapter.isNativePlatform() ? 'ulep://auth' : `${window.location.origin}/auth`
                            );

                            await browserAdapter.open(getInitialUrlUsecase.execute(redirectUri), '_self');
                        }}
                    >
                        {t('signup_page.sso_button')}
                    </button>
                )}
                {/* Department selector. */}
                {university && selectedRole && (
                    <div className="large-margin-top">
                        <TextInput
                            id="input-department"
                            onChange={setDepartment}
                            title={t('signup_page.department_title') as string}
                            value={department}
                            maxLength={50}
                        />
                    </div>
                )}
                {/* Staff function selector */}
                {university && selectedRole === 'STAFF' && (
                    <TextInput
                        id="input-staff-function"
                        onChange={setStaffFunction}
                        title={t('signup_page.function_title') as string}
                        value={staffFunction}
                        maxLength={50}
                    />
                )}
                {/* diploma selector */}
                {university && selectedRole === 'STUDENT' && (
                    <TextInput
                        id="input-diploma"
                        onChange={setDiploma}
                        title={t('signup_page.diplome_title') as string}
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
                        aria-label={t('signup_page.validate_button') as string}
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
