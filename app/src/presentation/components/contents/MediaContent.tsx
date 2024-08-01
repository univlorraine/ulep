import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LeftChevronSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import Conversation from '../../../domain/entities/chat/Conversation';
import { MessageType } from '../../../domain/entities/chat/Message';
import useHandleMessagesFromConversation from '../../hooks/useHandleMessagesFromConversation';
import Loader from '../Loader';
import MediasList from '../chat/MediasList';
import styles from './MediaContent.module.css';

interface MediaContentProps {
    conversation: Conversation;
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
}

const Content: React.FC<Omit<MediaContentProps, 'isHybrid'>> = ({ conversation, goBack, profile }) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<MessageType>(MessageType.Image);
    const { messages, isScrollOver, isLoading, loadMessages } = useHandleMessagesFromConversation(
        conversation.id,
        selectedFilter
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles['header-title']}>
                    {goBack && (
                        <IonButton
                            fill="clear"
                            onClick={goBack}
                            aria-label={t('chat.conversation_menu.aria_label') as string}
                        >
                            <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                        </IonButton>
                    )}
                    <h2 className={styles.title}>{t('chat.medias.title')}</h2>
                    <div style={{ width: '50px' }} />
                </div>
                <IonList lines="none" className={styles['header-filters']}>
                    <IonItem
                        button={true}
                        onClick={() => setSelectedFilter(MessageType.Image)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Image ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.images')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        onClick={() => setSelectedFilter(MessageType.File)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.File ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.files')}</IonLabel>
                    </IonItem>
                </IonList>
            </div>
            {isLoading ? (
                <div className={styles.loader}>
                    <Loader />
                </div>
            ) : (
                <MediasList
                    messages={messages}
                    loadMessages={loadMessages}
                    userId={profile.user.id}
                    isScrollOver={isScrollOver}
                />
            )}
        </div>
    );
};

const MediaContent: React.FC<MediaContentProps> = ({ conversation, isHybrid, goBack, profile }) => {
    if (!isHybrid) {
        return <Content conversation={conversation} goBack={goBack} profile={profile} />;
    }

    return (
        <IonPage className={styles.content}>
            <Content conversation={conversation} goBack={goBack} profile={profile} />
        </IonPage>
    );
};

export default MediaContent;
