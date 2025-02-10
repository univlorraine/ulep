import { IonModal } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import { useStoreState } from '../../../store/storeTypes';
import useGetLearningData from '../../hooks/useGetLearningData';
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
    const { tandems, error, isLoading } = useGetLearningData(false);

    const profile = useStoreState((state) => state.profile);

    if (!profile || isLoading || error) {
        return null;
    }

    const onSelectedLanguage = (language: LearningLanguage) => {
        setSelectedLanguage(language);
    };

    const onSelectedLanguageMobile = (language: LearningLanguage) => {
        const tandem = tandems.find((tandem) => tandem.learningLanguage.id === language.id);
        history.push('/vocabularies', { profile, tandem });
    };

    const onCloseModal = () => {
        setSelectedLanguage(undefined);
        onClose();
    };

    if (isHybrid) {
        return (
            <IonModal animated isOpen={isVisible} onDidDismiss={onCloseModal} className={`modal modal-side hybrid`}>
                <SelectLanguageContent
                    onBackPressed={onClose}
                    setSelectedLanguage={onSelectedLanguageMobile}
                    profile={profile}
                />
            </IonModal>
        );
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
