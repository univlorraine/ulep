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

import { IonButton, IonIcon, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AddSvg, ArrowRightSvg, LeftChevronSvg, WritingSkillPng } from '../../../assets';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import Goal from '../../../domain/entities/Goal';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import NetworkImage from '../NetworkImage';
import styles from './GoalsContent.module.css';
interface GoalsContentProps {
    profile: Profile;
    learningLanguage?: LearningLanguage;
    customLearningGoals?: CustomLearningGoal[];
    goBack?: () => void;
    onAddCustomGoalPressed: () => void;
    onShowCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
}

const GoalsContent = ({
    profile,
    goBack,
    learningLanguage,
    customLearningGoals,
    onAddCustomGoalPressed,
    onShowCustomGoalPressed,
}: GoalsContentProps) => {
    const { t } = useTranslation();
    const customGoals: CustomLearningGoal[] = customLearningGoals ?? learningLanguage?.customLearningGoals ?? [];
    const customGoalsCount: number = customGoals.length;

    return (
        <div className={`${styles.container}`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('goals.list.return_to_learning_aria_label') as string}
                        className={styles.back_button}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{t('goals.list.title')}</h2>
            </div>
            <ul className={styles.content} role="list">
                {profile.goals.map((goal: Goal) => (
                    <li key={goal.id} className={styles.goalItem} role="listitem">
                        <div className={styles.imageContainer}>
                            <NetworkImage
                                id={goal.image?.id ?? ''}
                                alt={goal.name}
                                className={styles.image}
                                placeholder={WritingSkillPng}
                                aria-hidden={true}
                            />
                        </div>
                        <p className={styles.goalName}>{goal.name}</p>
                    </li>
                ))}
                {customGoals.map((goal: CustomLearningGoal) => (
                    <li key={goal.id} role="listitem" className={styles.goalItem}>
                        <button className={styles.customGoalButton} onClick={() => onShowCustomGoalPressed(goal)}>
                            <div className={styles.goalTitleContainer}>
                                <h3 className={styles.goalTitle}>{goal.title}</h3>
                                <IonIcon icon={ArrowRightSvg} />
                            </div>
                            <p className={styles.goalDescription}>{goal.description}</p>
                        </button>
                    </li>
                ))}
            </ul>
            {customGoalsCount < 3 && (
                <IonButton fill="clear" className="add-button" onClick={onAddCustomGoalPressed}>
                    <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
                </IonButton>
            )}
        </div>
    );
};

export default GoalsContent;
