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
