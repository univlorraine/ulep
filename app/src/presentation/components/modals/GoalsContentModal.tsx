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

import { IonModal } from '@ionic/react';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import CustomGoalFormContent from '../contents/CustomGoalFormContent';
import CustomGoalShowContent from '../contents/CustomGoalShowContent';
import GoalsContent from '../contents/GoalsContent';
import styles from './ActivitiesContentModal.module.css';

export const DisplayCustomGoalModalEnum = {
    list: 'list',
    form: 'form',
    show: 'show',
};

export interface DisplayCustomGoalModal {
    type: (typeof DisplayCustomGoalModalEnum)[keyof typeof DisplayCustomGoalModalEnum];
    customLearningGoal?: CustomLearningGoal;
}

interface GoalsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    learningLanguage?: LearningLanguage;
    displayCustomGoalModal?: DisplayCustomGoalModal;
    onAddCustomGoalPressed: () => void;
    onShowAllGoalsPressed: () => void;
    onShowCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
    onUpdateCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
}

const GoalsContentModal = ({
    isVisible,
    onClose,
    profile,
    learningLanguage,
    displayCustomGoalModal,
    onAddCustomGoalPressed,
    onUpdateCustomGoalPressed,
    onShowAllGoalsPressed,
    onShowCustomGoalPressed,
}: GoalsContentModalProps) => {
    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.content}>
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.list && (
                    <GoalsContent
                        profile={profile}
                        goBack={onClose}
                        learningLanguage={learningLanguage}
                        onAddCustomGoalPressed={onAddCustomGoalPressed}
                        onShowCustomGoalPressed={onShowCustomGoalPressed}
                    />
                )}
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.form && learningLanguage?.id && (
                    <CustomGoalFormContent
                        customLearningGoal={displayCustomGoalModal.customLearningGoal}
                        learningLanguageId={learningLanguage.id}
                        goBack={onShowAllGoalsPressed}
                        onShowAllGoalsPressed={onShowAllGoalsPressed}
                    />
                )}
                {displayCustomGoalModal?.type === DisplayCustomGoalModalEnum.show &&
                    displayCustomGoalModal.customLearningGoal && (
                        <CustomGoalShowContent
                            customLearningGoal={displayCustomGoalModal.customLearningGoal}
                            goBack={onShowAllGoalsPressed}
                            onUpdateCustomGoalPressed={onUpdateCustomGoalPressed}
                            onShowAllGoalsPressed={onShowAllGoalsPressed}
                        />
                    )}
            </div>
        </IonModal>
    );
};

export default GoalsContentModal;
