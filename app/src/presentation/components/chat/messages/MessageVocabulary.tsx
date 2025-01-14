import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { useStoreState } from '../../../../store/storeTypes';
import VocabularyListCard from '../../card/VocabularyListCard';
import { MessageProps } from '../MessageComponent';
import styles from '../MessageComponent.module.css';
import LikeButton from './LikeButton';

const MessageVocabulary: React.FC<MessageProps> = ({ message, isCurrentUserMessage }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { addReaderToVocabularyList } = useConfig();
    const { profile } = useStoreState((state) => ({
        profile: state.profile,
    }));
    const messageClass = isCurrentUserMessage ? styles.currentUser : styles.otherUser;

    const handleVocabularyPressed = () => {
        if (!message.metadata.vocabularyList || !profile) {
            return;
        }

        const result = addReaderToVocabularyList.execute({
            vocabularyListId: message.metadata.vocabularyList.id,
            profileId: profile.id,
        });

        if (result instanceof Error) {
            return showToast({
                message: t(result.message),
                duration: 2000,
            });
        }

        return showToast({
            message: t('message.vocabulary.added'),
            duration: 2000,
        });
    };

    if (!message.metadata.vocabularyList) {
        return <div />;
    }

    return (
        <div className={messageClass}>
            <VocabularyListCard vocabularyList={message.metadata.vocabularyList} onPress={handleVocabularyPressed} />
            <LikeButton message={message} isCurrentUserMessage={isCurrentUserMessage} />
        </div>
    );
};

export default MessageVocabulary;
