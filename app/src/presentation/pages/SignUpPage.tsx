import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Country from '../../domain/entities/Country';
import University from '../../domain/entities/University';
import { useStoreActions } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import ErrorMessage from '../components/ErrorMessage';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import Person from '../../domain/entities/Person';

const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllCountries, retrievePerson } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
    const history = useHistory();
    const [countries, setCountries] = useState<DropDownItem<Country>[]>([]);
    const [country, setCountry] = useState<Country>();
    const [department, setDepartment] = useState<string>('');
    const [diplome, setDiplome] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<Role>();
    const [staffFunction, setStaffFunction] = useState<string>('');
    const [university, setUniversity] = useState<University>();
    const [displayError, setDisplayError] = useState<boolean>(false);

    const isAFieldEmpty =
        !university ||
        !country ||
        !selectedRole ||
        (!department && university.isCentral) ||
        (!diplome && selectedRole === 'student' && university.isCentral) ||
        (!staffFunction && selectedRole === 'staff' && university.isCentral);

    const getSignUpData = async () => {
        const countriesResult = await getAllCountries.execute();

        if (countriesResult instanceof Error) {
            return await showToast({ message: t(countriesResult.message), duration: 1000 });
        }

        return setCountries(
            countriesResult.map((country) => ({
                title: `${country.emoji ? country.emoji + ' ' : ''}${country.name}`,
                value: country,
            }))
        );
    };

    const continueSignUp = async () => {
        if (isAFieldEmpty) {
            return await showToast({ message: t('signup_page.missing_field'), duration: 3000 });
        }
        const now = new Date();
        if (university.admissionEnd < now || university.admissionStart > now) {
            return setDisplayError(true);
        }

        updateProfileSignUp({ country, department, diplome, role: selectedRole, staffFunction, university });

        return history.push('/signup/informations');
    };

    const onCountrySelected = (country: Country) => {
        setCountry(country);
        return setUniversity(country.universities[0]);
    };

    const getPersonInfos = async () => {
        const tokenKeycloak = "tokenKeycloakUltraSecret";
        const result = await retrievePerson.execute(tokenKeycloak) as Person;
        if (result.departement) {
            setDepartment(result.departement);
        }
        switch (selectedRole) {
            case "student":
                if(result.diploma){
                    setDiplome(result.diploma);
                }
                break;
            case "staff":
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        getSignUpData();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={12}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_page.title')}</h1>

                <h2 className={styles.subtitle}>{t('signup_page.profile_title')}</h2>

                <RadioButton
                    isSelected={selectedRole === 'student'}
                    onPressed={() => setSelectedRole('student')}
                    name={t('signup_page.student_role')}
                />
                <RadioButton
                    isSelected={selectedRole === 'staff'}
                    onPressed={() => setSelectedRole('staff')}
                    name={t('signup_page.staff_role')}
                />

                <div className="large-margin-top">
                    <Dropdown<Country>
                        onChange={onCountrySelected}
                        options={countries}
                        placeholder={t('signup_page.country_placeholder')}
                        title={t('global.country')}
                    />
                </div>

                <div className="large-margin-top">
                    <Dropdown<University>
                        onChange={setUniversity}
                        options={
                            country
                                ? country.universities.map((university) => ({
                                      title: university.name,
                                      value: university,
                                  }))
                                : []
                        }
                        title={t('signup_page.university_title')}
                    />
                </div>

                {university && university.isCentral && (
                    <button className="tertiary-button large-margin-vertical" onClick={getPersonInfos}>
                        {t('signup_page.sso_button')}
                    </button>
                )}

                {selectedRole && (
                    <div className="large-margin-top">
                        <TextInput
                            onChange={setDepartment}
                            title={t('signup_page.department_title')}
                            value={department}
                        />
                    </div>
                )}

                {selectedRole === 'staff' && (
                    <TextInput
                        onChange={setStaffFunction}
                        title={t('signup_page.function_title')}
                        value={staffFunction}
                    />
                )}

                {selectedRole === 'student' && (
                    <TextInput onChange={setDiplome} title={t('signup_page.diplome_title')} value={diplome} />
                )}
                {displayError && <ErrorMessage description={t('signup_page.error')} />}
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
                        className={`primary-button ${isAFieldEmpty ? 'disabled' : ''}`}
                        disabled={isAFieldEmpty}
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
