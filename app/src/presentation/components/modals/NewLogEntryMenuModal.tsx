import { IonContent, IonModal, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import { LogEntryType } from '../../../domain/entities/LogEntry';
import { useStoreState } from '../../../store/storeTypes';
import CreateOrUpdateCustomLogEntryContent from '../contents/learning-book/CreateOrUpdateCustomLogEntryContent';
import SelectLanguageContent from '../contents/SelectLanguageContent';

interface NewLogEntryMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    isHybrid?: boolean;
}

const NewsContentModal: React.FC<NewLogEntryMenuModalProps> = ({ isVisible, onClose, isHybrid }) => {
    const { createLogEntry } = useConfig();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const history = useHistory();
    const { profile } = useStoreState((state) => ({ profile: state.profile }));
    const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>();

    const createCustomLogEntry = async ({
        date,
        title,
        description,
    }: {
        date: Date;
        title: string;
        description: string;
    }) => {
        if (!selectedLanguage) {
            return;
        }

        const result = await createLogEntry.execute({
            type: LogEntryType.CUSTOM_ENTRY,
            learningLanguageId: selectedLanguage.id,
            metadata: {
                date,
                title,
                content: description,
            },
        });

        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        }

        onClose();
    };

    const onSelectedLanguage = (language: LearningLanguage) => {
        setSelectedLanguage(language);
    };

    const onSelectedLanguageMobile = (language: LearningLanguage) => {
        history.push('/learning-book', { learningLanguage: language });
    };

    const onCloseModal = () => {
        setSelectedLanguage(undefined);
        onClose();
    };

    if (!profile) {
        return null;
    }

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onCloseModal} className={`modal modal-side`}>
            {!selectedLanguage && (
                <SelectLanguageContent
                    onBackPressed={onClose}
                    setSelectedLanguage={onSelectedLanguage}
                    profile={profile}
                />
            )}
            {selectedLanguage && (
                <IonContent>
                    <CreateOrUpdateCustomLogEntryContent
                        onBackPressed={onClose}
                        profile={profile}
                        onSubmit={createCustomLogEntry}
                    />
                </IonContent>
            )}
        </IonModal>
    );
};

export default NewsContentModal;
