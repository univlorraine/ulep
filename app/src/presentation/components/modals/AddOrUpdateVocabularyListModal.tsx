import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import { CreateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/CreateVocabularyListUsecase.interface';
import { UpdateVocabularyListCommand } from '../../../domain/interfaces/vocabulary/UpdateVocabularyListUsecase.interface';
import { codeLanguageToFlag } from '../../utils';
import Dropdown from '../DropDown';
import TextInput from '../TextInput';
import styles from './AddOrUpdateVocabularyListModal.module.css';
import Modal from './Modal';

interface AddOrUpdateVocabularyListModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCreateVocabularyList: (createVocabularyList: CreateVocabularyListCommand) => void;
    onUpdateVocabularyList: (updateVocabularyList: UpdateVocabularyListCommand) => void;
    currentLearningLanguage: Language;
    profile: Profile;
    vocabularyList?: VocabularyList;
}

const AddOrUpdateVocabularyListModal: React.FC<AddOrUpdateVocabularyListModalProps> = ({
    isVisible,
    onClose,
    onCreateVocabularyList,
    onUpdateVocabularyList,
    currentLearningLanguage,
    profile,
    vocabularyList,
}) => {
    //TODO: Add REGEX for symbol
    const { t } = useTranslation();
    const [name, setName] = useState<string>('');
    const [symbol, setSymbol] = useState<string>('');
    const [translationLanguage, setTranslationLanguage] = useState<Language>(profile.nativeLanguage);
    const [targetLanguage, setTargetLanguage] = useState<Language>(
        currentLearningLanguage ?? profile.learningLanguages[0]
    );
    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const masteredLanguages = [profile.nativeLanguage, ...profile.masteredLanguages].map((language) => ({
        label: `${codeLanguageToFlag(language.code)} ${t(`languages_code.${language.code}`)}`,
        value: language,
    }));

    const learnLanguages = profile.learningLanguages.map((language) => ({
        label: `${codeLanguageToFlag(language.code)} ${t(`languages_code.${language.code}`)}`,
        value: language,
    }));

    const onValidate = () => {
        if (name.length === 0) {
            setErrorMessage({ type: 'name', message: t('vocabulary.list.add.name_error') });
            return;
        }

        if (symbol.length === 0) {
            setErrorMessage({ type: 'symbol', message: t('vocabulary.list.add.symbol_error') });
            return;
        }

        if (vocabularyList) {
            onUpdateVocabularyList({
                name,
                symbol,
                profileIds: [profile.id],
                wordLanguageCode: targetLanguage?.code,
                translationLanguageCode: translationLanguage?.code,
            });
        } else {
            onCreateVocabularyList({
                name,
                symbol,
                profileId: profile.id,
                wordLanguageCode: targetLanguage?.code,
                translationLanguageCode: translationLanguage?.code,
            });
        }
    };

    useEffect(() => {
        setErrorMessage(undefined);
        setName(vocabularyList?.name ?? '');
        setSymbol(vocabularyList?.symbol ?? '');
        setTranslationLanguage(vocabularyList?.translationLanguage ?? profile.nativeLanguage);
        setTargetLanguage(vocabularyList?.targetLanguage ?? currentLearningLanguage ?? profile.learningLanguages[0]);
    }, [isVisible, vocabularyList]);

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <div className={styles.container}>
                <h1 className={styles.title}>{t(`vocabulary.list.${vocabularyList ? 'update' : 'add'}.title`)}</h1>

                <TextInput
                    id="input-vocabulary-list-name"
                    onChange={(text) => setName(text)}
                    title={t('vocabulary.list.add.name') as string}
                    value={name}
                    maxLength={50}
                    errorMessage={errorMessage?.type === 'name' ? errorMessage.message : undefined}
                />
                <TextInput
                    id="input-vocabulary-list-symbol"
                    onChange={(text) => setSymbol(text)}
                    title={t('vocabulary.list.add.symbol') as string}
                    value={symbol}
                    maxLength={2}
                    errorMessage={errorMessage?.type === 'symbol' ? errorMessage.message : undefined}
                />

                <div className="large-margin-bottom">
                    <Dropdown<Language>
                        onChange={(value) => setTargetLanguage(value)}
                        value={{
                            label: `${codeLanguageToFlag(targetLanguage.code)} ${t(
                                `languages_code.${targetLanguage.code}`
                            )}`,
                            value: targetLanguage,
                        }}
                        options={learnLanguages}
                        placeholder={t('vocabulary.list.add.target_language')}
                        title={t('vocabulary.list.add.target_language')}
                        ariaLabel={t('vocabulary.list.add.target_language') as string}
                        required={true}
                        disabled={
                            Boolean(currentLearningLanguage) ||
                            (vocabularyList && vocabularyList?.numberOfVocabularies > 0)
                        }
                    />
                </div>

                <div className="large-margin-bottom">
                    <Dropdown<Language>
                        onChange={(value) => setTranslationLanguage(value)}
                        value={{
                            label: `${codeLanguageToFlag(translationLanguage.code)} ${t(
                                `languages_code.${translationLanguage.code}`
                            )}`,
                            value: translationLanguage,
                        }}
                        options={masteredLanguages}
                        placeholder={t('vocabulary.list.add.origin_language')}
                        title={t('vocabulary.list.add.origin_language')}
                        ariaLabel={t('vocabulary.list.add.origin_language') as string}
                        required={true}
                        disabled={vocabularyList && vocabularyList.numberOfVocabularies > 0}
                    />
                </div>

                <IonButton className="primary-button no-padding" fill="clear" onClick={onValidate}>
                    {t('vocabulary.list.add.create')}
                </IonButton>
                <IonButton className="secondary-button no-padding" fill="clear" onClick={onClose}>
                    {t('vocabulary.list.add.cancel')}
                </IonButton>
            </div>
        </Modal>
    );
};

export default AddOrUpdateVocabularyListModal;
