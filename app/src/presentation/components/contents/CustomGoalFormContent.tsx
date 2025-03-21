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
                    className={`primary-button no-padding`}
                    onClick={() => handleSubmit({ id: customLearningGoal?.id, title, description })}
                >
                    {customLearningGoal?.id ? t('goals.form.update_button') : t('goals.form.submit_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default CustomGoalFormContent;
