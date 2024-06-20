import { Redirect, useHistory, useLocation } from 'react-router';
import ChatContent from '../../components/contents/ChatContent';
import Conversation from '../../../domain/entities/chat/Conversation';
import { useStoreState } from '../../../store/storeTypes';

interface ChatPageProps {
    conversation: Conversation;
}

const ChatPage = () => {
    const history = useHistory();
    const location = useLocation<ChatPageProps>();
    const { conversation } = location.state;
    const profile = useStoreState((state) => state.profile);

    const goBack = () => {
        history.goBack();
    };

    if (!conversation) {
        return <Redirect to="/conversations" />;
    }

    if (!profile) {
        return <Redirect to="/" />;
    }

    return <ChatContent conversation={conversation} goBack={goBack} userId={profile.user.id} isHybrid />;
};

export default ChatPage;
