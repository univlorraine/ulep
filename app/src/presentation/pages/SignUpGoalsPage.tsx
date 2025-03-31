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
    const { configuration, getAllGoals, deviceAdapter } = useConfig();
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
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
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
                                    style={{ backgroundColor: isIncluded ? configuration.primaryColor : '#F2F4F7' }}
                                >
                                    {goal.image ? (
                                        <NetworkImage
                                            id={goal.image.id}
                                            alt={goal.name}
                                            className={goalsStyles.image}
                                            placeholder={WritingSkillPng}
                                            aria-hidden={true}
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
