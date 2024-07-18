import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import CategoryInterests, { Interest } from '../../domain/entities/CategoryInterests';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import interestStyle from './css/SignUpInterests.module.css';

const SignUpInterestsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllInterestCategories } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const [catergoriesInterests, setCatergoriesInterests] = useState<CategoryInterests[]>([]);
    const [userInterests, setUserInterests] = useState<string[]>(profileEdit.interests ? profileEdit.interests : []);

    const getInterests = async () => {
        const result = await getAllInterestCategories.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setCatergoriesInterests(result);
    };

    const interestPressed = (item: Interest) => {
        const currentInterests = [...userInterests];
        const index = currentInterests.findIndex((interest) => interest === item.id);

        if (index !== -1) {
            currentInterests.splice(index, 1);
        } else if (currentInterests.length < 10) {
            currentInterests.push(item.id);
        }

        return setUserInterests(currentInterests);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ interests: userInterests });

        history.push('/signup/biography');
    };

    useEffect(() => {
        getInterests();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={60}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('signup_interests_page.title')}</h1>
                    <h2 className="subtitle">{t('signup_interests_page.subtitle')}</h2>

                    {catergoriesInterests.map((categoryInterest) => {
                        return (
                            <div key={categoryInterest.id}>
                                <span className={interestStyle['category-title']}>{categoryInterest.name}</span>
                                <ul className={interestStyle['interests-container']}>
                                    {categoryInterest.interests.map((interest) => {
                                        const isInclued = userInterests.includes(interest.id);
                                        return (
                                            <li key={interest.id}>
                                                <button
                                                    aria-label={interest.name}
                                                    className={interestStyle.tags}
                                                    onClick={() => interestPressed(interest)}
                                                    role="checkbox"
                                                    aria-checked={isInclued}
                                                    disabled={userInterests.length === 10 ? !isInclued : false}
                                                    style={{
                                                        backgroundColor: isInclued ? '#FDEE66' : 'white',
                                                        borderWidth: 1,
                                                        borderColor: isInclued ? '#FDEE66' : 'black',
                                                    }}
                                                >
                                                    <span
                                                        className={interestStyle['tags-text']}
                                                        style={{ fontWeight: isInclued ? 'bold' : 'normal' }}
                                                    >
                                                        {interest.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <p style={{ textAlign: 'center' }}>{t('signup_interests_page.required_mention')}</p>

                <div className="extra-large-margin-bottom">
                    <button
                        aria-label={t('signup_interests_page.validate_button') as string}
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
