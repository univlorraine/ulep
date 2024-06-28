import { Redirect, useHistory, useLocation } from 'react-router';
import Conversation from '../../../domain/entities/chat/Conversation';
import { useStoreState } from '../../../store/storeTypes';
import ChatContent from '../../components/contents/ChatContent';

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

    return <ChatContent conversation={conversation} goBack={goBack} profile={profile} isHybrid />;
};

export default ChatPage;
