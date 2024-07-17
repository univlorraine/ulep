import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { WritingSkillPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import Goal from '../../domain/entities/Goal';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import NetworkImage from '../components/NetworkImage';
import styles from './css/SignUp.module.css';
import goalsStyles from './css/SignUpGoals.module.css';

const SignUpGoalsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllGoals } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [userGoals, setUserGoals] = useState<Goal[]>(profileEdit.goals ? profileEdit.goals : []);

    const getGoals = async () => {
        const result = await getAllGoals.execute();
        if (result instanceof Error) {
            return await showToast({
                message: t(result.message),
                duration: 1000,
            });
        }

        return setGoals(result);
    };

    const goalPressed = (item: Goal) => {
        const currentGoals = [...userGoals];
        const index = currentGoals.findIndex((goal) => goal.id === item.id);

        if (index !== -1) {
            currentGoals.splice(index, 1);
        } else if (currentGoals.length < 3) {
            currentGoals.push(item);
        }

        return setUserGoals(currentGoals);
    };

    const continueSignUp = async (goals: Goal[]) => {
        updateProfileSignUp({ goals });

        history.push('/signup/interests');
    };

    useEffect(() => {
        getGoals();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={48}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <div className={goalsStyles.content}>
                    <h1 className="title">{t('signup_goals_page.title')}</h1>
                    <span className="subtitle">{t('signup_goals_page.subtitle')}</span>

                    <div className={`${goalsStyles['goals-container']} large-margin-top`}>
                        {goals.map((goal) => {
                            const isIncluded = userGoals.findIndex((userGoal) => userGoal.id === goal.id) !== -1;
                            return (
                                <button
                                    role="checkbox"
                                    aria-checked={isIncluded}
                                    key={goal.id}
                                    aria-label={goal.name}
                                    className={goalsStyles['goal-container']}
                                    onClick={() => goalPressed(goal)}
                                    style={{ backgroundColor: isIncluded ? '#FDEE66' : '#F2F4F7' }}
                                >
                                    {goal.image ? (
                                        <NetworkImage
                                            id={goal.image.id}
                                            alt={goal.name}
                                            className={goalsStyles.image}
                                            placeholder={WritingSkillPng}
                                        />
                                    ) : (
                                        <img
                                            alt=""
                                            className={goalsStyles.image}
                                            src={WritingSkillPng}
                                            aria-hidden={true}
                                        />
                                    )}
                                    <span
                                        className={goalsStyles.description}
                                        style={{ fontWeight: isIncluded ? 'bold' : 'normal' }}
                                    >
                                        {goal.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className={`${goalsStyles['bottom-container']} large-margin-top`}>
                    <button
                        aria-label={t('signup_goals_page.pass_button') as string}
                        className={`tertiary-button`}
                        disabled={goals.length === 0}
                        onClick={() => continueSignUp([])}
                    >
                        {t('signup_goals_page.pass_button')}
                    </button>
                    <button
                        aria-label={t('signup_goals_page.validate_button') as string}
                        className={`primary-button ${userGoals.length === 0 ? 'disabled' : ''}`}
                        disabled={userGoals.length === 0}
                        onClick={() => continueSignUp(userGoals)}
                    >
                        {t('signup_goals_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpGoalsPage;
