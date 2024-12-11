import { useEffect, useState } from 'react';
import { Activity } from '../../../../domain/entities/Activity';
import Profile from '../../../../domain/entities/Profile';
import useGetActivityThemes from '../../../hooks/useGetActivityThemes';
import ActivitiesContent from './ActivitiesContent';
import { ActivityContent } from './ActivityContent';
import CreateActivityContent from './CreateOrUpdateActivityContent';

interface ActivitiesContainerContentProps {
    onClose: () => void;
    profile: Profile;
    isModal?: boolean;
    currentActivityId?: string;
}

const ActivitiesContainerContent: React.FC<ActivitiesContainerContentProps> = ({
    onClose,
    profile,
    isModal,
    currentActivityId,
}) => {
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

    useEffect(() => {
        if (currentActivityId) {
            setActivityIdToDisplay(currentActivityId);
        }
    }, [currentActivityId]);

    return (
        <>
            {!displayCreateActivity && !activityIdToDisplay && (
                <ActivitiesContent
                    onAddActivity={() => setDisplayCreateActivity(true)}
                    onBackPressed={onClose}
                    themes={activityThemes}
                    onActivityClick={(activity) => setActivityIdToDisplay(activity.id)}
                    profile={profile}
                    isModal={isModal}
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
    );
};

export default ActivitiesContainerContent;
