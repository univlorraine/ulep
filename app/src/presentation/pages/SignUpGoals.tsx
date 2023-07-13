import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Goal from '../../domain/entities/Goal';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import goalsStyles from './css/SignUpGoals.module.css';

const SignUpGoals: React.FC = () => {
    const { t } = useTranslation();
    const { getAllGoals } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [userGoals, setUserGoals] = useState<Goal[]>([]);

    const getGoals = async () => {
        const result = await getAllGoals.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
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

    const continueSignUp = async () => {
        updateProfileSignUp({ goals });

        //Todo: add navigate later
    };

    useEffect(() => {
        getGoals();
    }, []);

    return (
        <WebLayoutCentered headerColor="#FDEE66" headerPercentage={48} headerTitle={t('global.create_account_title')}>
            <div className={styles.body}>
                <div className={goalsStyles.content}>
                    <h1 className={goalsStyles.title}>{t('signup_goals_page.title')}</h1>
                    <span className={goalsStyles.subtitle}>{t('signup_goals_page.subtitle')}</span>

                    <div className={goalsStyles['goals-container']}>
                        {goals.map((goal) => {
                            return (
                                <div
                                    key={goal.id}
                                    className={goalsStyles['goal-container']}
                                    onClick={() => goalPressed(goal)}
                                    style={{
                                        backgroundColor:
                                            userGoals.length === 0 ||
                                            userGoals.findIndex((userGoal) => userGoal.id === goal.id) === -1
                                                ? '#F2F4F7'
                                                : '#FDEE66',
                                    }}
                                >
                                    <img alt={goal.id} className={goalsStyles.image} src={goal.image} />
                                    <span className={goalsStyles.description}>{goal.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={`${goalsStyles['bottom-container']} large-margin-bottom`}>
                    <button
                        className={`tertiary-button`}
                        disabled={goals.length === 0}
                        onClick={() => history.push('/')} //TODO: Change history push later
                    >
                        {t('signup_goals_page.pass_button')}
                    </button>
                    <button
                        className={`primary-button ${userGoals.length === 0 ? 'disabled' : ''}`}
                        disabled={userGoals.length === 0}
                        onClick={continueSignUp}
                    >
                        {t('signup_goals_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpGoals;
