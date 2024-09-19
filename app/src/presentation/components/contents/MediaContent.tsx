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
    setImageToDisplay: (image: string) => void;
}

const Content: React.FC<Omit<MediaContentProps, 'isHybrid'>> = ({
    conversation,
    goBack,
    setImageToDisplay,
    profile,
}) => {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState<MessageType>(MessageType.Image);
    const { messages, isScrollForwardOver, isLoading, loadMessages } = useHandleMessagesFromConversation({
        conversationId: conversation.id,
        typeFilter: selectedFilter,
        limit: 30,
    });
    const partner = Conversation.getMainConversationPartner(conversation, profile.id);

    return (
        <div className={`${styles.container} content-wrapper`}>
            <div className={styles.header}>
                <div className={styles['header-title']}>
                    {goBack && (
                        <IonButton
                            fill="clear"
                            onClick={goBack}
                            aria-label={
                                t('chat.conversation_menu.return_to_chat_aria_label', {
                                    name: partner.firstname,
                                }) as string
                            }
                        >
                            <IonIcon icon={LeftChevronSvg} size="medium" aria-hidden="true" />
                        </IonButton>
                    )}
                    <h2 className={styles.title}>{t('chat.medias.title')}</h2>
                    <div style={{ width: '50px' }} aria-hidden="true" />
                </div>
                <IonList lines="none" className={styles['header-filters']}>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Image)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Image ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.images')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.File)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.File ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.files')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Audio)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Audio ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.audios')}</IonLabel>
                    </IonItem>
                    <IonItem
                        button={true}
                        detail={false}
                        onClick={() => setSelectedFilter(MessageType.Link)}
                        className={`${styles.btnFilters} ${
                            selectedFilter === MessageType.Link ? styles.btnFiltersActive : ''
                        }`}
                    >
                        <IonLabel>{t('chat.medias.links')}</IonLabel>
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
                    isScrollOver={isScrollForwardOver}
                    selectedFilter={selectedFilter}
                    setImageToDisplay={setImageToDisplay}
                />
            )}
        </div>
    );
};

const MediaContent: React.FC<MediaContentProps> = ({ conversation, isHybrid, goBack, profile, setImageToDisplay }) => {
    if (!isHybrid) {
        return (
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                setImageToDisplay={setImageToDisplay}
            />
        );
    }

    return (
        <IonPage>
            <Content
                conversation={conversation}
                goBack={goBack}
                profile={profile}
                setImageToDisplay={setImageToDisplay}
            />
        </IonPage>
    );
};

export default MediaContent;
