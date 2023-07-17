import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import CategoryInterests from '../../domain/entities/CategoryInterests';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import interestStyle from './css/SignUpInterests.module.css';

const SignUpInterestsPage: React.FC = () => {
    const { t } = useTranslation();
    const { getAllCategoriesInterests } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [catergoriesInterests, setCatergoriesInterests] = useState<CategoryInterests[]>([]);
    const [userInterests, setUserInterests] = useState<string[]>([]);

    const getInterests = async () => {
        const result = await getAllCategoriesInterests.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setCatergoriesInterests(result);
    };

    const interestPressed = (item: string) => {
        const currentInterests = [...userInterests];
        const index = currentInterests.findIndex((interest) => interest === item);

        if (index !== -1) {
            currentInterests.splice(index, 1);
        } else if (currentInterests.length < 10) {
            currentInterests.push(item);
        }

        return setUserInterests(currentInterests);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ interests: userInterests });

        //Todo: add navigate later
    };

    useEffect(() => {
        getInterests();
    }, []);

    return (
        <WebLayoutCentered headerColor="#FDEE66" headerPercentage={60} headerTitle={t('global.create_account_title')}>
            <div className={styles.body}>
                <div>
                    <h1 className={interestStyle.title}>{t('signup_interests_page.title')}</h1>
                    <h2 className={interestStyle.subtitle}>{t('signup_interests_page.subtitle')}</h2>

                    {catergoriesInterests.map((categoryInterest) => {
                        return (
                            <div key={categoryInterest.id}>
                                <span className={interestStyle['category-title']}>{categoryInterest.name}</span>
                                <div className={interestStyle['interests-container']}>
                                    {categoryInterest.interests.map((interest) => {
                                        const isInclued = userInterests.includes(interest);
                                        return (
                                            <button
                                                className={interestStyle.tags}
                                                key={interest}
                                                onClick={() => interestPressed(interest)}
                                                style={{
                                                    backgroundColor: isInclued ? '#FDEE66' : 'white',
                                                    borderWidth: isInclued ? 0 : 1,
                                                }}
                                            >
                                                <span className={interestStyle['tags-text']}>{interest}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={`${styles['bottom-container']} large-margin-bottom`}>
                    <button
                        className={`primary-button ${userInterests.length < 5 ? 'disabled' : ''}`}
                        disabled={userInterests.length < 5}
                        onClick={continueSignUp}
                    >
                        {t('signup_interests_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpInterestsPage;
