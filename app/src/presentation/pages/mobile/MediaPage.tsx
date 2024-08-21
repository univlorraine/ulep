import { IonContent } from '@ionic/react';
import { useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../../domain/entities/chat/Conversation';
import { useStoreState } from '../../../store/storeTypes';
import MediaContent from '../../components/contents/MediaContent';
import Modal from '../../components/modals/Modal';
import styles from '../css/ChatPage.module.css';

interface MediaPageProps {
    conversation: Conversation;
}

const MediaPage = () => {
    const history = useHistory();
    const location = useLocation<MediaPageProps>();
    const { conversation } = location.state;
    const profile = useStoreState((state) => state.profile);
    const [imageToDisplay, setImageToDisplay] = useState<string | undefined>(undefined);

    if (!conversation) {
        return <Redirect to="/conversations" />;
    }

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/chat', { conversation });
    };

    return (
        <>
            <IonContent>
                <MediaContent
                    conversation={conversation}
                    goBack={goBack}
                    profile={profile}
                    isHybrid
                    setImageToDisplay={setImageToDisplay}
                />
            </IonContent>
            <Modal
                className={styles.modal}
                isVisible={Boolean(imageToDisplay)}
                onClose={() => setImageToDisplay(undefined)}
            >
                <img className={styles['image-modal']} src={imageToDisplay} />
            </Modal>
        </>
    );
};

export default MediaPage;
