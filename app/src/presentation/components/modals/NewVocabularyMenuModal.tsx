import { IonModal } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import { useStoreState } from '../../../store/storeTypes';
import SelectLanguageContent from '../contents/SelectLanguageContent';
import VocabularyContent from '../contents/VocabularyContent';

interface NewVocabularyMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    isHybrid?: boolean;
}

const NewVocabularyMenuModal: React.FC<NewVocabularyMenuModalProps> = ({ isVisible, onClose, isHybrid }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>();
    const history = useHistory();

    const profile = useStoreState((state) => state.profile);
    if (!profile) {
        return null;
    }

    const onSelectedLanguage = (language: LearningLanguage) => {
        setSelectedLanguage(language);
    };

    const onSelectedLanguageMobile = (language: LearningLanguage) => {
        history.push('/vocabularies', { language });
    };

    const onCloseModal = () => {
        setSelectedLanguage(undefined);
        onClose();
    };

    if (isHybrid) {
        return (
            <IonModal
                animated
                isOpen={isVisible}
                onDidDismiss={onCloseModal}
                className={`modal modal-side ${isHybrid ? 'hybrid' : ''}`}
            >
                <SelectLanguageContent
                    onBackPressed={onClose}
                    setSelectedLanguage={onSelectedLanguageMobile}
                    profile={profile}
                />
            </IonModal>
        );
    }

    return (
        <IonModal
            animated
            isOpen={isVisible}
            onDidDismiss={onCloseModal}
            className={`modal modal-side ${isHybrid ? 'hybrid' : ''}`}
        >
            {!selectedLanguage && (
                <SelectLanguageContent
                    onBackPressed={onClose}
                    setSelectedLanguage={onSelectedLanguage}
                    profile={profile}
                />
            )}
            {selectedLanguage && (
                <VocabularyContent
                    profile={profile}
                    onClose={() => setSelectedLanguage(undefined)}
                    isModal
                    currentLearningLanguage={selectedLanguage}
                />
            )}
        </IonModal>
    );
};

export default NewVocabularyMenuModal;
