import { useHistory } from "react-router";
import useGetConversations from "./useGetConversations";
import useWindowDimensions from "./useWindowDimensions";
import { HYBRID_MAX_WIDTH } from "../utils";

interface UseOnOpenChatProps {
    tandemId: string;
    withAdministrator?: boolean;
}

const useOnOpenChat = ({ tandemId, withAdministrator = false }: UseOnOpenChatProps) => {
    const history = useHistory();
    const { conversations, error, isLoading } = useGetConversations();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    if (error || isLoading) return () => {};

    const onOpenChat = () => {

        if (isHybrid) {
            if (withAdministrator) {
                history.push('/chat', {
                    conversation: conversations.find((conversation) => conversation.id === tandemId && (
                        conversation.participants.some((participant) => participant.isAdministrator)
                    ))
                });
            } else {
                history.push('/chat', { conversation: conversations.find((conversation) => conversation.id === tandemId) });
            }
        } else {
            history.push('/conversations', { tandemId });
        }
    };

    return onOpenChat;
};

export default useOnOpenChat;
