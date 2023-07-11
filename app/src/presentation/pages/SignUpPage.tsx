import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import roles from '../../domain/entities/roles';
import Dropdown from '../components/DropDown';
import Header from '../components/Header';
import RadioButton from '../components/RadioButton';
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [selectedRole, setSelectedRole] = useState<roles>();

    const handleSelectChange = (role: roles) => {
        setSelectedRole(role);
    };

    return (
        <IonPage>
            <Header progressColor="#FDEE66" progressPercentage={12} title={t('global.create_account_title')} />
            <IonContent>
                <div className={styles.container}>
                    <h1 className={styles.title}>Mon profil</h1>

                    <h2 className={styles.subtitle}>Mon profil</h2>

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

                    <p className={styles.subtitle}>Pays</p>
                    <Dropdown options={[{ title: 'a', value: 'a' }]} />

                    <p className={styles.subtitle}>Etablissement</p>
                    <Dropdown options={[{ title: 'a', value: 'a' }]} />

                    <button className="tertiary-button large-margin-top" onClick={() => null}>
                        M’authentifier
                    </button>

                    {selectedRole && <div className={styles.separator} />}

                    {selectedRole === 'STAFF' && <div></div>}

                    {!selectedRole && (
                        <p className={styles.information}>
                            Votre université n'est pas encore partenaire de l'Université de Lorraine ? Contactez-nous à
                            email@contact.fr
                        </p>
                    )}
                    <button className="primary-button" onClick={() => null}>
                        Valider et continuer
                    </button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignUpPage;
