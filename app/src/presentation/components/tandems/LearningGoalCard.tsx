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

import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { WritingSkillPng } from '../../../assets';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import Goal from '../../../domain/entities/Goal';
import Profile from '../../../domain/entities/Profile';
import LearningCard from '../card/LearningCard';
import NetworkImage from '../NetworkImage';
import styles from './LearningGoalCard.module.css';

interface LearningGoalCardProps {
    profile: Profile;
    customLearningGoals?: CustomLearningGoal[];
    onShowAllGoalsPressed: () => void;
}

const LearningGoalCard: React.FC<LearningGoalCardProps> = ({ profile, customLearningGoals, onShowAllGoalsPressed }) => {
    const { t } = useTranslation();
    const goalsCount = profile.goals.length + (customLearningGoals?.length ?? 0);

    return (
        <LearningCard title={t('learning_goal.title', { count: goalsCount })}>
            <div className={styles.container}>
                <ul className={styles.content}>
                    {profile.goals.map((goal: Goal) => (
                        <li key={goal.id} className={styles.goalItem}>
                            <div className={styles.imageContainer}>
                                <NetworkImage
                                    id={goal.image?.id ?? ''}
                                    alt={goal.name}
                                    className={styles.image}
                                    placeholder={WritingSkillPng}
                                    aria-hidden={true}
                                />
                            </div>
                            <p>{goal.name}</p>
                        </li>
                    ))}
                    {customLearningGoals?.map((customLearningGoal: CustomLearningGoal) => (
                        <li key={customLearningGoal.id} role="listitem" className={styles.goalItem}>
                            <div className={styles.customLearningGoalContainer}>
                                <h3 className={styles.goalTitle}>{customLearningGoal.title}</h3>
                                <p className={styles.goalDescription}>{customLearningGoal.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles.buttons}>
                    <IonButton fill="clear" className="primary-button no-padding" onClick={onShowAllGoalsPressed}>
                        {t('learning_goal.button')}
                    </IonButton>
                </div>
            </div>
        </LearningCard>
    );
};

export default LearningGoalCard;
