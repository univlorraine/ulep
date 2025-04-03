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

import { IonButton, IonIcon } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import CustomLearningGoal from '../../../domain/entities/CustomLearningGoal';
import ConfirmModal from '../modals/ConfirmModal';
import styles from './CustomGoalShowContent.module.css';

interface CustomGoalShowContentProps {
    customLearningGoal: CustomLearningGoal;
    onUpdateCustomGoalPressed: (customLearningGoal: CustomLearningGoal) => void;
    onShowAllGoalsPressed: (customLearningGoals?: CustomLearningGoal[]) => void;
    goBack: () => void;
}

const CustomGoalShowContent = ({
    customLearningGoal,
    onUpdateCustomGoalPressed,
    goBack,
    onShowAllGoalsPressed,
}: CustomGoalShowContentProps) => {
    const { t } = useTranslation();
    const { deleteCustomLearningGoal } = useConfig();
    const [isDeleteCustomGoalModalVisible, setIsDeleteCustomGoalModalVisible] = useState(false);

    const onDeleteCustomGoalPressed = () => {
        setIsDeleteCustomGoalModalVisible(true);
    };

    const handleDeleteCustomGoal = async () => {
        const customLearningGoals = await deleteCustomLearningGoal.execute({ id: customLearningGoal.id });

        setIsDeleteCustomGoalModalVisible(false);

        if (customLearningGoals instanceof Error) {
            return;
        }

        onShowAllGoalsPressed(customLearningGoals);
    };

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                {goBack && (
                    <IonButton
                        fill="clear"
                        onClick={goBack}
                        aria-label={t('goals.return_to_list_aria_label') as string}
                        className={styles.back_button}
                    >
                        <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                    </IonButton>
                )}
                <h2 className={styles.title}>{t('goals.show.title')}</h2>
            </div>
            <div className={styles.content}>
                <h3 className={styles.label}>{t('goals.show.title_label')}</h3>
                <p className={styles.show_title}>{customLearningGoal?.title}</p>
                <h3 className={styles.label}>{t('goals.show.description_label')}</h3>
                <p className={styles.show_description}>{customLearningGoal?.description}</p>
            </div>
            <div className={styles.buttons}>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={() => onUpdateCustomGoalPressed(customLearningGoal)}
                >
                    {t('goals.show.update_button')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button no-padding" onClick={onDeleteCustomGoalPressed}>
                    {t('goals.show.delete_button')}
                </IonButton>
            </div>
            <ConfirmModal
                isVisible={isDeleteCustomGoalModalVisible}
                onClose={() => setIsDeleteCustomGoalModalVisible(false)}
                onValidate={handleDeleteCustomGoal}
                title={t('goals.confirm_delete')}
            />
        </div>
    );
};

export default CustomGoalShowContent;
