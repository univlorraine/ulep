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
import { addSharp, chevronDownOutline, chevronUpOutline, trashBinOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../../domain/entities/Activity';
import TextInput from '../../TextInput';
import styles from './CreateActivityExcerciseContent.module.css';

interface CreateActivityExcerciseContentProps {
    onSubmit: (excercises: { content: string; order: number }[]) => void;
    onBackPressed: () => void;
    activityToUpdate?: Activity;
}

export const CreateActivityExcerciseContent: React.FC<CreateActivityExcerciseContentProps> = ({
    onSubmit,
    onBackPressed,
    activityToUpdate,
}) => {
    const { t } = useTranslation();
    const [excercises, setExcercises] = useState<{ content: string; order: number }[]>(
        activityToUpdate?.exercises ?? [
            {
                content: '',
                order: 0,
            },
            {
                content: '',
                order: 1,
            },
            {
                content: '',
                order: 2,
            },
        ]
    );

    const allRequiredFieldsAreFilled = () => {
        return excercises.filter((excercise) => excercise.content.length > 0).length >= 3;
    };

    const handleSubmit = () => {
        onSubmit(excercises);
    };

    const onAddExcercisePressed = () => {
        if (excercises.length >= 6) {
            return;
        }
        setExcercises([...excercises, { content: '', order: excercises.length }]);
    };

    const onContentExcerciseChange = (content: string, order: number) => {
        const newExcercises = [...excercises];
        newExcercises[order].content = content;
        setExcercises(newExcercises);
    };

    const onDeleteExcercisePressed = (order: number) => {
        const newExcercises = [...excercises];
        newExcercises.splice(order, 1);
        const exercicesUpdated = newExcercises
            .sort((a, b) => a.order - b.order)
            .map((exc, index) => ({ ...exc, order: index }));
        setExcercises(exercicesUpdated);
    };

    const onUpExcercisePressed = (order: number) => {
        if (order === 0) return;
        const newExcercises = [...excercises];
        [newExcercises[order - 1], newExcercises[order]] = [newExcercises[order], newExcercises[order - 1]];
        setExcercises(newExcercises.map((exc, index) => ({ ...exc, order: index })));
    };

    const onDownExcercisePressed = (order: number) => {
        if (order === excercises.length - 1) return;
        const newExcercises = [...excercises];
        [newExcercises[order + 1], newExcercises[order]] = [newExcercises[order], newExcercises[order + 1]];
        setExcercises(newExcercises.map((exc, index) => ({ ...exc, order: index })));
    };

    return (
        <div>
            <h1 className="title">{t('activity.create.title_excercise')}</h1>
            <p className="subtitle">{t('activity.create.subtitle_excercise')}</p>

            {excercises
                .sort((a, b) => a.order - b.order)
                .map((excercise, index) => (
                    <div className={styles['excercise-container']}>
                        <div className={styles['excercise-header-container']}>
                            <p className={styles['excercise-title']}>{t('activity.create.excercise')}</p>
                            <div className={styles['excercise-button-container']}>
                                <IonButton
                                    fill="clear"
                                    onClick={() => onDeleteExcercisePressed(index)}
                                    aria-label={t('activity.create.delete_excercise_button') as string}
                                >
                                    <IonIcon icon={trashBinOutline} color="dark" aria-hidden />
                                </IonButton>
                                {index > 0 && (
                                    <IonButton
                                        fill="clear"
                                        onClick={() => onUpExcercisePressed(index)}
                                        aria-label={t('activity.create.up_excercise_button') as string}
                                    >
                                        <IonIcon icon={chevronUpOutline} color="dark" aria-hidden />
                                    </IonButton>
                                )}
                                {index < excercises.length - 1 && (
                                    <IonButton
                                        fill="clear"
                                        onClick={() => onDownExcercisePressed(index)}
                                        aria-label={t('activity.create.down_excercise_button') as string}
                                    >
                                        <IonIcon icon={chevronDownOutline} color="dark" aria-hidden />
                                    </IonButton>
                                )}
                            </div>
                        </div>
                        <TextInput
                            id={`input-excercise-${index}`}
                            title=""
                            onChange={(text) => onContentExcerciseChange(text, excercise.order)}
                            value={excercise.content}
                            placeholder={t('activity.create.excercise_placeholder') as string}
                            type="text-area"
                            maxLength={250}
                            showLimit
                        />
                    </div>
                ))}

            <IonButton
                fill="clear"
                className="tertiary-button no-padding margin-bottom"
                onClick={onAddExcercisePressed}
            >
                <IonIcon icon={addSharp} />
                {t('activity.create.add_excercise_button')}
            </IonButton>
            <div className={`${styles['button-container']} large-margin-top`}>
                <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                    {t('activity.create.cancel_button')}
                </IonButton>
                <IonButton
                    fill="clear"
                    className={`primary-button no-padding ${!allRequiredFieldsAreFilled() ? 'disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!allRequiredFieldsAreFilled()}
                >
                    {t('activity.create.validate_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default CreateActivityExcerciseContent;
