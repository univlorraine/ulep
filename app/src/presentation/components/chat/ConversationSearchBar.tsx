import { IonButton, IonIcon, IonSearchbar, useIonToast } from '@ionic/react';
import { t } from 'i18next';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useState } from 'react';
import { CloseBlackSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Conversation from '../../../domain/entities/chat/Conversation';
import styles from './ConversationSearchBar.module.css';

interface ConversationSearchBarProps {
    conversation: Conversation;
    loadMessages: (messageId: string) => void;
    setIsSearchMode: (isSearchMode: boolean) => void;
}

const ConversationSearchBar: React.FC<ConversationSearchBarProps> = ({
    setIsSearchMode,
    conversation,
    loadMessages,
}) => {
    const { searchMessagesIdsFromConversation } = useConfig();
    const [showToast] = useIonToast();
    const [messagesIds, setMessagesIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const searchForMessages = async (searchText: string) => {
        const messagesIds = await searchMessagesIdsFromConversation.execute(conversation.id, searchText);

        if (messagesIds instanceof Error) {
            return showToast({
                message: t(messagesIds.message),
                duration: 2000,
                color: 'danger',
            });
        }

        setMessagesIds(messagesIds);
        setCurrentIndex(0);
        loadMessages(messagesIds[currentIndex]);
    };

    const onClear = () => {
        setMessagesIds([]);
        setCurrentIndex(0);
        setIsSearchMode(false);
    };

    const goPrevious = () => {
        if (currentIndex < messagesIds.length - 1) {
            setCurrentIndex(currentIndex + 1);
            loadMessages(messagesIds[currentIndex + 1]);
        } else {
            setCurrentIndex(0);
            loadMessages(messagesIds[0]);
        }
    };

    const goNext = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            loadMessages(messagesIds[currentIndex - 1]);
        } else {
            setCurrentIndex(messagesIds.length - 1);
            loadMessages(messagesIds[messagesIds.length - 1]);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <IonSearchbar
                placeholder={t('chat.search.placeholder') as string}
                onIonChange={(e) => searchForMessages(e.detail.value as string)}
                onIonCancel={onClear}
                cancelButtonIcon={CloseBlackSvg}
                cancelButtonText="close"
                showCancelButton="always"
            ></IonSearchbar>
            <IonButton fill="clear" className={styles.searchIcon} onClick={goPrevious}>
                <IonIcon icon={chevronBackOutline} />
            </IonButton>
            <IonButton fill="clear" className={styles.searchIcon} onClick={goNext}>
                <IonIcon icon={chevronForwardOutline} />
            </IonButton>
        </div>
    );
};

export default ConversationSearchBar;
