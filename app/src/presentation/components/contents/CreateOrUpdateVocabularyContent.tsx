import { IonButton, useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import Vocabulary from '../../../domain/entities/Vocabulary';
import VocabularyList from '../../../domain/entities/VocabularyList';
import { codeLanguageToFlag } from '../../utils';
import AudioLine from '../AudioLine';
import HeaderSubContent from '../HeaderSubContent';
import RecordingButton from '../RecordingButton';
import TextInput from '../TextInput';
import styles from './CreateOrUpdateVocabularyContent.module.css';

interface CreateOrUpdateVocabularyContentProps {
    vocabulary?: Vocabulary;
    vocabularyList: VocabularyList;
    onDelete: (id: string) => void;
    onSubmit: (
        word: string,
        translation: string,
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
    const [word, setWord] = useState(vocabulary?.word || '');
    const { recorderAdapter } = useConfig();
    const [translation, setTranslation] = useState(vocabulary?.translation || '');
    const [isRecording, setIsRecording] = useState(false);
    const [translationPronunciation, setTranslationPronunciation] = useState<File>();
    const [wordPronunciation, setWordPronunciation] = useState<File>();
    const [hideUploadedWordPronunciation, setHideUploadedWordPronunciation] = useState<boolean>(false);
    const [hideUploadedTranslationPronunciation, setHideUploadedTranslationPronunciation] = useState<boolean>(false);

    const displayWordPronunciation = vocabulary?.pronunciationWordUrl && !hideUploadedWordPronunciation;
    const displayTranslationPronunciation =
        vocabulary?.pronunciationTranslationUrl && !hideUploadedTranslationPronunciation;

    const onRecordWord = () => {
        if (isRecording || wordPronunciation) {
            return;
        }

        handleStartRecord(setWordPronunciation);
    };

    const onRecordTranslation = () => {
        if (isRecording || translationPronunciation) {
            return;
        }

        handleStartRecord(setTranslationPronunciation);
    };

    const onStopRecordWord = () => {
        handleStopRecord(setWordPronunciation);
    };

    const onStopRecordTranslation = () => {
        handleStopRecord(setTranslationPronunciation);
    };

    const handleStartRecord = (fileSetter: Function) => {
        setIsRecording(true);
        recorderAdapter.startRecording((audio, error) => {
            if (error) {
                return showToast({
                    message: t(error.message),
                    duration: 5000,
                });
            }
            setIsRecording(false);
            fileSetter(audio);
        });
    };

    const handleStopRecord = (fileSetter: Function) => {
        setIsRecording(false);
        recorderAdapter.stopRecording((audio, error) => {
            if (error) {
                return showToast({
                    message: t(error.message),
                    duration: 5000,
                });
            }
            setIsRecording(false);
            fileSetter(audio);
        });
    };

    const onHideUploadedWordPronunciation = () => {
        setHideUploadedWordPronunciation(true);
        setWordPronunciation(undefined);
    };

    const onHideUploadedTranslationPronunciation = () => {
        setHideUploadedTranslationPronunciation(true);
        setTranslationPronunciation(undefined);
    };

    useEffect(() => {
        recorderAdapter.requestPermission();
    }, []);

    return (
        <div className={`subcontent-container content-wrapper`}>
            <HeaderSubContent
                title={`${vocabularyList.symbol} ${vocabularyList.name}`}
                onBackPressed={() => goBack?.()}
            />
            <h1 className={styles.language}>{vocabularyList.translationLanguage.name}</h1>
            <div className={styles.content}>
                <TextInput
                    beforeInput={
                        <span className={styles.flag}>
                            {codeLanguageToFlag(vocabularyList.translationLanguage.code)}
                        </span>
                    }
                    value={translation}
                    onChange={(value) => setTranslation(value)}
                    placeholder={vocabulary?.translation ?? t('vocabulary.pair.add.default_translation')}
                />
                <div className={styles.pronunciationContainer}>
                    <div className={styles.playerContainer}>
                        <span className={styles.pronunciation}>{t('vocabulary.pair.add.pronunciation')}</span>
                        {(displayTranslationPronunciation || translationPronunciation) && (
                            <AudioLine
                                audioFile={translationPronunciation || vocabulary?.pronunciationTranslationUrl || ''}
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
                        />
                    )}
                </div>
            </div>

            <h1 className={styles.language}>{vocabularyList.wordLanguage.name}</h1>
            <div className={styles.content}>
                <TextInput
                    beforeInput={
                        <span className={styles.flag}>{codeLanguageToFlag(vocabularyList.wordLanguage.code)}</span>
                    }
                    value={word}
                    onChange={(value) => setWord(value)}
                    placeholder={vocabulary?.word ?? t('vocabulary.pair.add.default_word')}
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
                        className={`primary-button no-padding ${!word && !translation ? 'disabled' : ''}`}
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
                        className="primary-button no-padding"
                        onClick={() =>
                            onSubmit(
                                word,
                                translation,
                                vocabulary.id,
                                wordPronunciation,
                                translationPronunciation,
                                Boolean(vocabulary.pronunciationTranslationUrl) && hideUploadedTranslationPronunciation,
                                Boolean(vocabulary.pronunciationWordUrl) && hideUploadedWordPronunciation
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
    );
};

export default CreateOrUpdateVocabularyContent;
