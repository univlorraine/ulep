import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import SuccessLayout from '../components/SuccessLayout';
import styles from './css/SignUpFinalPage.module.css';

const SignupFinalPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const profileSignUp = useStoreState((payload) => payload.profileSignUp);
    const image = profileSignUp.profilePicture;

    return (
        <SuccessLayout backgroundColorCode="#b6aa43" color={'yellow'} colorCode={'#fdee66'}>
            <div className={styles.container}>
                <h1 className={styles.title}>{`${t('signup_end_page.thanks')} ${profileSignUp.firstname}, ${t(
                    'signup_end_page.account'
                )}`}</h1>
                <img className={styles.image} alt="avatar" src={profileSignUp.profilePicture} />
                <p className={styles.description}>{t('signup_end_page.description')}</p>
                <button className="primary-button" onClick={() => history.push('/')}>
                    {t('signup_end_page.validate_button')}
                </button>
            </div>
        </SuccessLayout>
    );
};

export default SignupFinalPage;
