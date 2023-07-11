import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Country from '../../domain/entities/Country';
import University from '../../domain/entities/University';
import roles from '../../domain/entities/roles';
import Dropdown, { DropDownItem } from '../components/DropDown';
import Header from '../components/Header';
import RadioButton from '../components/RadioButton';
import TextInput from '../components/TextInput';
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const { getAllCountries, getAllUniversities } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const [countries, setCountries] = useState<DropDownItem<Country>[]>([]);
    const [country, setCountry] = useState<Country>();
    const [department, setDepartment] = useState<string>('');
    const [diplome, setDiplome] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<roles>();
    const [staffFunction, setStaffFunction] = useState<string>('');
    const [universities, setUniversities] = useState<DropDownItem<University>[]>([]);
    const [university, setUniversity] = useState<string>('');

    const getSignUpData = async () => {
        const [countriesResult, universityResult] = await Promise.all([
            getAllCountries.execute(),
            getAllUniversities.execute(),
        ]);

        if (countriesResult instanceof Error) {
            return await showToast({ message: t(countriesResult.message), duration: 1000 });
        }

        if (universityResult instanceof Error) {
            return await showToast({ message: t(universityResult.message), duration: 1000 });
        }

        setCountries(countriesResult.map((country) => ({ title: country.name, value: country })));

        return setUniversities(universityResult.map((university) => ({ title: university.name, value: university })));
    };

    useEffect(() => {
        getSignUpData();
    }, []);

    return (
        <IonPage>
            <Header progressColor="#FDEE66" progressPercentage={12} title={t('global.create_account_title')} />
            <IonContent>
                <div className={styles.container}>
                    <h1 className={styles.title}>{t('signup_page.title')}</h1>

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

                    <Dropdown
                        onChange={setCountry}
                        options={countries}
                        placeholder={t('signup_page.country_placeholder')}
                        title={t('global.country')}
                    />

                    <Dropdown
                        onChange={setUniversity}
                        options={universities}
                        title={t('signup_page.university_title')}
                    />

                    {selectedRole !== 'STAFF' && (
                        <button className="tertiary-button large-margin-top" onClick={() => null}>
                            {t('signup_page.sso_button')}
                        </button>
                    )}

                    {selectedRole === 'STUDENT' && <div className={styles.separator} />}

                    {selectedRole && (
                        <TextInput
                            onChange={setDepartment}
                            title={t('signup_page.department_title')}
                            value={department}
                        />
                    )}

                    {selectedRole === 'STAFF' && (
                        <TextInput
                            onChange={setStaffFunction}
                            title={t('signup_page.function_title')}
                            value={staffFunction}
                        />
                    )}

                    {selectedRole === 'STUDENT' && (
                        <TextInput onChange={setDiplome} title={t('signup_page.diplome_title')} value={diplome} />
                    )}

                    {!selectedRole && <p className={styles.information}>{t('signup_page.footer')}</p>}
                    <button className="primary-button large-margin-bottom" onClick={() => null}>
                        {t('signup_page.validate_button')}
                    </button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignUpPage;
