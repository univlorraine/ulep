import { IonModal } from '@ionic/react';
import { useState } from 'react';
import { Activity } from '../../../domain/entities/Activity';
import { useStoreState } from '../../../store/storeTypes';
import useGetActivityThemes from '../../hooks/useGetActivityThemes';
import { ActivityContent } from '../contents/activity/ActivityContent';
import CreateActivityContent from '../contents/activity/CreateOrUpdateActivityContent';

interface NewActivityMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    isHybrid?: boolean;
}

const NewActivityMenuModal: React.FC<NewActivityMenuModalProps> = ({ isVisible, onClose, isHybrid }) => {
    const [displayCreateActivity, setDisplayCreateActivity] = useState<boolean>(true);
    const [activityIdToDisplay, setActivityIdToDisplay] = useState<string | undefined>();
    const [activityToUpdate, setActivityToUpdate] = useState<Activity | undefined>();
    const { activityThemes } = useGetActivityThemes();

    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return null;
    }

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
        setDisplayCreateActivity(true);
        setActivityIdToDisplay(undefined);
        onClose();
    };

    return (
        <>
            <IonModal
                animated
                isOpen={isVisible}
                onDidDismiss={onClose}
                className={`modal modal-side ${isHybrid ? 'hybrid' : ''}`}
            >
                {displayCreateActivity && (
                    <CreateActivityContent
                        themes={activityThemes}
                        onBackPressed={onClose}
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
            </IonModal>
        </>
    );
};

export default NewActivityMenuModal;
