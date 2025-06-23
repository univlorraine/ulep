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
import TextInput from '../TextInput';
import styles from './CustomGoalFormContent.module.css';

export interface CustomLearningGoalFormData {
    id?: string;
    title: string;
    description: string;
}

interface CustomGoalFormContentProps {
    customLearningGoal?: CustomLearningGoal;
    learningLanguageId: string;
    goBack: () => void;
    onShowAllGoalsPressed: (customLearningGoals: CustomLearningGoal[]) => void;
}

const CustomGoalFormContent = ({
    customLearningGoal,
    learningLanguageId,
    goBack,
    onShowAllGoalsPressed,
}: CustomGoalFormContentProps) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState<string>(customLearningGoal?.title || '');
    const [description, setDescription] = useState<string>(customLearningGoal?.description || '');
    const { createCustomLearningGoal, updateCustomLearningGoal } = useConfig();

    const handleSubmit = async ({ id, title, description }: CustomLearningGoalFormData) => {
        if (id) {
            const customLearningGoals = await updateCustomLearningGoal.execute({
                id,
                title,
                description,
            });

            if (customLearningGoals instanceof Error) {
                return;
            }

            onShowAllGoalsPressed(customLearningGoals);
        } else {
            const customLearningGoals = await createCustomLearningGoal.execute({
                title,
                description,
                learningLanguageId,
            });

            if (customLearningGoals instanceof Error) {
                return;
            }

            onShowAllGoalsPressed(customLearningGoals);
        }
    };

    return (
        <div className={`${styles.container}`}>
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
                <h2 className={styles.title}>
                    {t(`goals.form.${customLearningGoal?.id ? 'update_title' : 'create_title'}`)}
                </h2>
            </div>
            <div className={styles.content}>
                <TextInput
                    id="input-title"
                    title={t('goals.form.title') as string}
                    value={title}
                    onChange={(value) => setTitle(value)}
                    required={true}
                />
                <TextInput
                    id="input-description"
                    title={t('goals.form.description') as string}
                    value={description}
                    onChange={(value) => setDescription(value)}
                    type="text-area"
                />
            </div>
            <div className={`${styles['button-container']}`}>
                <IonButton fill="clear" className="tertiary-button no-padding" onClick={goBack}>
                    {t('goals.form.cancel_button')}
                </IonButton>
                <IonButton
                    fill="clear"
                    className={`primary-button no-padding ${title.length === 0 ? 'disabled' : ''}`}
                    disabled={title.length === 0}
                    onClick={() => handleSubmit({ id: customLearningGoal?.id, title, description })}
                >
                    {customLearningGoal?.id ? t('goals.form.update_button') : t('goals.form.submit_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default CustomGoalFormContent;
