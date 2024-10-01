import { useState } from 'react';
import Profile from '../../../domain/entities/Profile';
import useGetActivityThemes from '../../hooks/useGetActivityThemes';
import ActivitiesContent from '../contents/activity/ActivitiesContent';
import { ActivityContent } from '../contents/activity/ActivityContent';
import CreateActivityContent from '../contents/activity/CreateActivityContent';
import Modal from './Modal';

interface ActivitiesContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const ActivitiesContentModal: React.FC<ActivitiesContentModalProps> = ({ isVisible, onClose, profile }) => {
    const [displayCreateActivity, setDisplayCreateActivity] = useState<boolean>(false);
    const [activityIdToDisplay, setActivityIdToDisplay] = useState<string | undefined>();

    const { activityThemes, isLoading: isLoadingActivityThemes } = useGetActivityThemes();

    const handleNavigateAfterCreate = (activityId: string) => {
        setActivityIdToDisplay(activityId);
        setDisplayCreateActivity(false);
    };

    return (
        <Modal isVisible={isVisible} onClose={onClose} position="flex-end" hideWhiteBackground>
            <>
                {!displayCreateActivity && !activityIdToDisplay && (
                    <ActivitiesContent
                        onAddActivity={() => setDisplayCreateActivity(true)}
                        onBackPressed={onClose}
                        themes={activityThemes}
                        onActivityClick={(activity) => setActivityIdToDisplay(activity.id)}
                        profile={profile}
                    />
                )}
                {displayCreateActivity && (
                    <CreateActivityContent
                        themes={activityThemes}
                        onBackPressed={() => setDisplayCreateActivity(false)}
                        profile={profile}
                        onNavigatePressed={handleNavigateAfterCreate}
                    />
                )}
                {activityIdToDisplay && (
                    <ActivityContent
                        onBackPressed={() => setActivityIdToDisplay(undefined)}
                        activityId={activityIdToDisplay}
                        profile={profile}
                    />
                )}
            </>
        </Modal>
    );
};

export default ActivitiesContentModal;
