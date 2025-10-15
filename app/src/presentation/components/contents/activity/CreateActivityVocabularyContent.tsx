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

import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { addSharp, trashBinOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity } from '../../../../domain/entities/Activity';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder';
import AudioLine from '../../AudioLine';
import Loader from '../../Loader';
import RecordingButton from '../../RecordingButton';
import TextInput from '../../TextInput';
import styles from './CreateActivityVocabularyContent.module.css';

interface CreateActivityVocabularyContentProps {
    onSubmit: (vocabularies: { content: string; file?: File }[], vocabulariesToDelete?: string[]) => Promise<void>;
    onBackPressed: () => void;
    activityToUpdate?: Activity;
}

export const CreateActivityVocabularyContent: React.FC<CreateActivityVocabularyContentProps> = ({
    onSubmit,
    onBackPressed,
    activityToUpdate,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { recorderAdapter } = useConfig();
    const [vocabularies, setVocabularies] = useState<
        { id?: string; content: string; file?: File; pronunciationUrl?: string }[]
    >(activityToUpdate?.vocabularies ?? []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recordingIndex, setRecordingIndex] = useState<number | null>(null);

    const { isRecording, audioFile, error, startRecording, stopRecording, clearAudioFile, clearError } =
        useAudioRecorder(recorderAdapter);

    useEffect(() => {
        if (error) {
            showToast({
                message: t(error),
                duration: 5000,
            });
            clearError();
        }
    }, [error, showToast, t, clearError]);

    useEffect(() => {
        if (audioFile && recordingIndex !== null) {
            setVocabularies((prevVocabularies) => {
                const newVocabularies = [...prevVocabularies];
                if (newVocabularies[recordingIndex]) {
                    newVocabularies[recordingIndex].file = audioFile;
                }
                return newVocabularies;
            });
            setRecordingIndex(null);
            clearAudioFile();
        }
    }, [audioFile, recordingIndex, clearAudioFile]);

    const handleDeleteVocabulary = (index: number) => {
        // If the element is being recorded, stop the recording
        if (recordingIndex === index) {
            setRecordingIndex(null);
            stopRecording();
        } else if (recordingIndex !== null && recordingIndex > index) {
            // Adjust the recording index if an element is deleted before
            setRecordingIndex(recordingIndex - 1);
        }

        const newVocabularies = vocabularies.filter((_, i) => i !== index);
        setVocabularies(newVocabularies);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        await onSubmit(vocabularies);
        setIsLoading(false);
    };

    const onAddVocabularyPressed = () => {
        setVocabularies([...vocabularies, { content: '', file: undefined }]);
    };

    const onDeletePronunciation = (index: number) => {
        const newVocabularies = [...vocabularies];
        newVocabularies[index].file = undefined;
        newVocabularies[index].pronunciationUrl = undefined;
        setVocabularies(newVocabularies);
    };

    const onUpdateContentVocabulary = (content: string, index: number) => {
        const newVocabularies = [...vocabularies];
        newVocabularies[index].content = content;
        setVocabularies(newVocabularies);
    };

    const handleStartRecord = (index: number) => {
        if (isRecording) {
            return;
        }

        setRecordingIndex(index);
        startRecording();
    };

    const handleStopRecord = () => {
        stopRecording();
    };

    const allVocabulariesAreFilled = vocabularies.every((vocabulary) => vocabulary.content !== '');

    return (
        <div>
            <h1 className="title">{t('activity.create.title_vocabulary')}</h1>
            <p className="subtitle">{t('activity.create.subtitle_vocabulary')}</p>

            {vocabularies.map((vocabulary, index) => (
                <div key={vocabulary.id || `vocabulary-${index}`} className={styles['vocabulary-line']}>
                    <div className={styles['vocabulary-container']}>
                        <TextInput
                            id={`input-vocabulary-${index}`}
                            title=""
                            onChange={(content) => onUpdateContentVocabulary(content, index)}
                            placeholder={t('activity.create.vocabulary_placeholder') as string}
                            maxLength={30}
                            value={vocabulary.content}
                        />
                        <div className={styles['pronunciation-container']}>
                            <div className={styles['player-line']}>
                                <span className={styles['pronunciation']}>{t('activity.create.pronunciation')}</span>
                                {(vocabulary.file || vocabulary.pronunciationUrl) && (
                                    <AudioLine
                                        audioFile={(vocabulary.file || vocabulary.pronunciationUrl)!}
                                        hideProgressBar
                                        small
                                    />
                                )}
                            </div>
                            <div className={styles['action-container']}>
                                {vocabulary.file || vocabulary.pronunciationUrl ? (
                                    <IonButton
                                        className={styles['delete-pronunciation']}
                                        fill="clear"
                                        onClick={() => onDeletePronunciation(index)}
                                    >
                                        {t('activity.create.delete_pronunciation')}
                                    </IonButton>
                                ) : (
                                    <RecordingButton
                                        mode="record"
                                        handleStartRecord={() => handleStartRecord(index)}
                                        handleStopRecord={handleStopRecord}
                                        isBlocked={false}
                                        hideSendButton
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <IonButton
                        fill="clear"
                        onClick={() => handleDeleteVocabulary(index)}
                        aria-label={t('activity.create.delete_vocabulary_button') as string}
                    >
                        <IonIcon icon={trashBinOutline} color="dark" aria-hidden />
                    </IonButton>
                </div>
            ))}

            <IonButton
                fill="clear"
                className="tertiary-button no-padding margin-bottom"
                onClick={onAddVocabularyPressed}
            >
                <IonIcon icon={addSharp} aria-hidden />
                {t('activity.create.add_vocabulary_button')}
            </IonButton>
            {!isLoading ? (
                <div className="large-margin-top">
                    <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                        {t('activity.create.cancel_button')}
                    </IonButton>
                    <IonButton
                        fill="clear"
                        className={`primary-button no-paddin ${allVocabulariesAreFilled ? '' : 'disabled'}`}
                        onClick={handleSubmit}
                        disabled={!allVocabulariesAreFilled}
                    >
                        {t('activity.create.validate_button')}
                    </IonButton>
                </div>
            ) : (
                <div className={styles['loader-container']}>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default CreateActivityVocabularyContent;
