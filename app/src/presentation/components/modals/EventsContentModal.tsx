import EventObject from '../../../domain/entities/Event';
import Profile from '../../../domain/entities/Profile';
import EventsContent from '../contents/events/EventsContent';
import { EventsListContent } from '../contents/events/EventsListContent';
import Modal from './Modal';

export const DisplayEventsContentModalEnum = {
    show: 'show',
    list: 'list',
};

export interface DisplayEventsContentModal {
    type: (typeof DisplayEventsContentModalEnum)[keyof typeof DisplayEventsContentModalEnum];
    event?: EventObject;
}

interface NewsContentModalProps {
    isVisible: boolean;
    displayEventsContentModal?: DisplayEventsContentModal;
    onClose: () => void;
    onEventPressed: (event?: EventObject) => void;
    profile: Profile;
}

const NewsContentModal: React.FC<NewsContentModalProps> = ({
    isVisible,
    displayEventsContentModal,
    onClose,
    onEventPressed,
    profile,
}) => {
    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <>
                {displayEventsContentModal?.type === DisplayEventsContentModalEnum.list && (
                    <EventsListContent profile={profile} onBackPressed={onClose} onEventPressed={onEventPressed} />
                )}
                {displayEventsContentModal?.type === DisplayEventsContentModalEnum.show &&
                    displayEventsContentModal.event && (
                        <EventsContent
                            event={displayEventsContentModal.event}
                            onBackPressed={onClose}
                            profile={profile}
                        />
                    )}
            </>
        </Modal>
    );
};

export default NewsContentModal;
