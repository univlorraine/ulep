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

import { IonButton, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import Vocabulary from '../../../domain/entities/Vocabulary';
import VocabularyList from '../../../domain/entities/VocabularyList';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { codeLanguageToFlag } from '../../utils';
import AudioLine from '../AudioLine';
import HeaderSubContent from '../HeaderSubContent';
import RecordingButton from '../RecordingButton';
import TextInput from '../TextInput';
import styles from './CreateOrUpdateVocabularyContent.module.css';

enum RecordingMode {
    WORD = 'word',
    TRANSLATION = 'translation',
}

interface CreateOrUpdateVocabularyContentProps {
    vocabulary?: Vocabulary;
    vocabularyList: VocabularyList;
    onDelete: (id: string) => void;
    onSubmit: (
        word: string,
        translation?: string,
        id?: string,
        wordPronunciation?: File,
        translationPronunciation?: File,
        deletePronunciationWord?: boolean,
        deletePronunciationTranslation?: boolean
    ) => void;
    goBack: () => void;
}

const CreateOrUpdateVocabularyContent: React.FC<CreateOrUpdateVocabularyContentProps> = ({
    vocabulary,
    vocabularyList,
    onDelete,
    onSubmit,
    goBack,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { recorderAdapter } = useConfig();
    const [word, setWord] = useState(vocabulary?.word || '');
    const [translation, setTranslation] = useState(vocabulary?.translation || '');
    const [translationPronunciation, setTranslationPronunciation] = useState<File>();
    const [wordPronunciation, setWordPronunciation] = useState<File>();
    const [hideUploadedWordPronunciation, setHideUploadedWordPronunciation] = useState<boolean>(false);
    const [hideUploadedTranslationPronunciation, setHideUploadedTranslationPronunciation] = useState<boolean>(false);
    const [activeRecording, setActiveRecording] = useState<RecordingMode | null>(null);

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
        if (audioFile && activeRecording) {
            if (activeRecording === RecordingMode.WORD) {
                setWordPronunciation(audioFile);
            } else if (activeRecording === RecordingMode.TRANSLATION) {
                setTranslationPronunciation(audioFile);
            }
            setActiveRecording(null);
            clearAudioFile();
        }
    }, [audioFile, activeRecording, clearAudioFile]);

    const displayWordPronunciation = vocabulary?.pronunciationWordUrl && !hideUploadedWordPronunciation;
    const displayTranslationPronunciation =
        vocabulary?.pronunciationTranslationUrl && !hideUploadedTranslationPronunciation;

    const onRecordWord = () => {
        if (isRecording || wordPronunciation) {
            return;
        }
        setActiveRecording(RecordingMode.WORD);
        startRecording();
    };

    const onRecordTranslation = () => {
        if (isRecording || translationPronunciation) {
            return;
        }
        setActiveRecording(RecordingMode.TRANSLATION);
        startRecording();
    };

    const onStopRecordWord = () => {
        stopRecording();
    };

    const onStopRecordTranslation = () => {
        stopRecording();
    };

    const onHideUploadedWordPronunciation = () => {
        setHideUploadedWordPronunciation(true);
        setWordPronunciation(undefined);
    };

    const onHideUploadedTranslationPronunciation = () => {
        setHideUploadedTranslationPronunciation(true);
        setTranslationPronunciation(undefined);
    };

    return (
        <div>
            <HeaderSubContent
                title={`${vocabularyList.symbol} ${vocabularyList.name}`}
                onBackPressed={() => goBack?.()}
            />
            <div className={styles.container} role="list">
                <h2 className={styles.language}>{vocabularyList.targetLanguage.name}</h2>
                <div className={styles.content} role="listitem">
                    <TextInput
                        beforeInput={
                            <span className={styles.flag}>
                                {codeLanguageToFlag(vocabularyList.targetLanguage.code)}
                            </span>
                        }
                        lang={vocabularyList.targetLanguage.code}
                        value={word}
                        onChange={(value) => setWord(value)}
                        placeholder={vocabulary?.word ?? t('vocabulary.pair.add.default_word')}
                        required={true}
                    />
                    <div className={styles.pronunciationContainer}>
                        <div className={styles.pronunciationContainer}>
                            <span className={styles.pronunciation}>{t('vocabulary.pair.add.pronunciation')}</span>
                            {(displayWordPronunciation || wordPronunciation) && (
                                <AudioLine
                                    audioFile={wordPronunciation || vocabulary?.pronunciationWordUrl || ''}
                                    hideProgressBar
                                />
                            )}
                        </div>
                        {wordPronunciation || displayWordPronunciation ? (
                            <IonButton
                                className={styles.addPronunciation}
                                fill="clear"
                                onClick={onHideUploadedWordPronunciation}
                            >
                                {t('vocabulary.pair.add.delete_prounonciation')}
                            </IonButton>
                        ) : (
                            <RecordingButton
                                mode="record"
                                handleStartRecord={onRecordWord}
                                handleStopRecord={onStopRecordWord}
                                isBlocked={false}
                                hideSendButton={true}
                            />
                        )}
                    </div>
                </div>

                <h2 className={styles.language}>{vocabularyList.translationLanguage.name}</h2>
                <div className={styles.content} role="listitem">
                    <TextInput
                        id="input-translation"
                        beforeInput={
                            <span className={styles.flag}>
                                {codeLanguageToFlag(vocabularyList.translationLanguage.code)}
                            </span>
                        }
                        value={translation}
                        onChange={(value) => setTranslation(value)}
                        placeholder={vocabulary?.translation ?? t('vocabulary.pair.add.default_translation')}
                        lang={vocabularyList.translationLanguage.code}
                        required={false}
                    />
                    <div className={styles.pronunciationContainer}>
                        <div className={styles.playerContainer}>
                            <span className={styles.pronunciation}>{t('vocabulary.pair.add.pronunciation')}</span>
                            {(displayTranslationPronunciation || translationPronunciation) && (
                                <AudioLine
                                    audioFile={
                                        translationPronunciation || vocabulary?.pronunciationTranslationUrl || ''
                                    }
                                    hideProgressBar
                                />
                            )}
                        </div>
                        {translationPronunciation || displayTranslationPronunciation ? (
                            <IonButton
                                className={styles.addPronunciation}
                                fill="clear"
                                onClick={onHideUploadedTranslationPronunciation}
                            >
                                {t('vocabulary.pair.add.delete_prounonciation')}
                            </IonButton>
                        ) : (
                            <RecordingButton
                                mode="record"
                                handleStartRecord={onRecordTranslation}
                                handleStopRecord={onStopRecordTranslation}
                                isBlocked={false}
                                hideSendButton={true}
                            />
                        )}
                    </div>
                </div>
                {!vocabulary ? (
                    <div className={`${styles.buttonContainer} ${styles.buttonCreateContainer}`}>
                        <IonButton fill="clear" className="tertiary-button no-padding" onClick={goBack}>
                            {t('vocabulary.pair.add.cancel')}
                        </IonButton>
                        <IonButton
                            fill="clear"
                            className={`primary-button no-padding ${!word ? 'disabled' : ''}`}
                            disabled={!word}
                            onClick={() =>
                                onSubmit(word, translation, undefined, wordPronunciation, translationPronunciation)
                            }
                        >
                            {t('vocabulary.pair.add.save')}
                        </IonButton>
                    </div>
                ) : (
                    <div className={styles.buttonContainer}>
                        <IonButton
                            fill="clear"
                            className={`primary-button no-padding ${!word ? 'disabled' : ''}`}
                            disabled={!word}
                            onClick={() =>
                                onSubmit(
                                    word,
                                    translation,
                                    vocabulary.id,
                                    wordPronunciation,
                                    translationPronunciation,
                                    Boolean(vocabulary.pronunciationWordUrl) && hideUploadedWordPronunciation,
                                    Boolean(vocabulary.pronunciationTranslationUrl) &&
                                        hideUploadedTranslationPronunciation
                                )
                            }
                        >
                            {t('vocabulary.pair.update.save')}
                        </IonButton>
                        <IonButton
                            fill="clear"
                            className="secondary-button no-padding"
                            onClick={() => onDelete(vocabulary.id)}
                        >
                            {t('vocabulary.pair.update.delete')}
                        </IonButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateOrUpdateVocabularyContent;
