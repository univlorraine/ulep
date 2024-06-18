import { IonContent, IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import styles from './ConversationsContent.module.css';
import Conversation from '../../../domain/entities/chat/Conversation';
import ConversationsLines from '../chat/ConversationsLines';
import Profile from '../../../domain/entities/Profile';
import Loader from '../Loader';

interface ConversationsContentProps {
    conversations: Conversation[];
    isLoading: boolean;
    profile: Profile;
}

const ConversationsContent: React.FC<ConversationsContentProps> = ({ conversations, isLoading, profile }) => {
    const { t } = useTranslation();

    return (
        <IonPage className={styles.content}>
            <IonContent>
                <div className={`${styles.container}`}>
                    <div className={styles.header}>
                        <span className={styles.title}>{t('conversations.title')}</span>
                    </div>
                    {!isLoading && <ConversationsLines conversations={conversations} userId={profile.user.id} />}
                    {isLoading && <Loader />}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ConversationsContent;
