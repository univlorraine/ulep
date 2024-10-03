import { useState } from 'react';
import { Activity } from '../../../domain/entities/Activity';
import Profile from '../../../domain/entities/Profile';
import useGetActivityThemes from '../../hooks/useGetActivityThemes';
import ActivitiesContent from '../contents/activity/ActivitiesContent';
import { ActivityContent } from '../contents/activity/ActivityContent';
import CreateActivityContent from '../contents/activity/CreateOrUpdateActivityContent';
import Modal from './Modal';

interface ActivitiesContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
}

const ActivitiesContentModal: React.FC<ActivitiesContentModalProps> = ({ isVisible, onClose, profile }) => {
    const [displayCreateActivity, setDisplayCreateActivity] = useState<boolean>(false);
    const [activityIdToDisplay, setActivityIdToDisplay] = useState<string | undefined>();
    const [activityToUpdate, setActivityToUpdate] = useState<Activity | undefined>();
    const { activityThemes } = useGetActivityThemes();

    const handleNavigateAfterCreate = (activityId: string) => {
        setActivityIdToDisplay(activityId);
        setDisplayCreateActivity(false);
    };

    const handleUpdateActivity = (activity: Activity) => {
        setActivityToUpdate(activity);
        setDisplayCreateActivity(true);
        setActivityIdToDisplay(undefined);
    };

    const onBackPressed = () => {
        setActivityToUpdate(undefined);
        setDisplayCreateActivity(false);
        setActivityIdToDisplay(undefined);
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
                        onBackPressed={onBackPressed}
                        profile={profile}
                        onNavigatePressed={handleNavigateAfterCreate}
                        activityToUpdate={activityToUpdate}
                    />
                )}
                {activityIdToDisplay && (
                    <ActivityContent
                        onBackPressed={onBackPressed}
                        onUpdateActivityPressed={handleUpdateActivity}
                        activityId={activityIdToDisplay}
                        profile={profile}
                    />
                )}
            </>
        </Modal>
    );
};

export default ActivitiesContentModal;
