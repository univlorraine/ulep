import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Activity } from '../../../domain/entities/Activity';
import { useStoreState } from '../../../store/storeTypes';
import ActivitiesContent from '../../components/contents/activity/ActivitiesContent';
import { ActivityContent } from '../../components/contents/activity/ActivityContent';
import CreateActivityContent from '../../components/contents/activity/CreateOrUpdateActivityContent';
import useGetActivityThemes from '../../hooks/useGetActivityThemes';

interface ActivitiesPageProps {
    activityId?: string;
}

const ActivitiesPage = () => {
    const history = useHistory();
    const location = useLocation<ActivitiesPageProps>();
    const { activityId } = location.state || {};
    const profile = useStoreState((state) => state.profile);
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

    if (!profile) {
        return <Redirect to="/" />;
    }

    const goBack = () => {
        history.push('/learning');
    };

    useEffect(() => {
        if (activityId) {
            setActivityIdToDisplay(activityId);
        }
    }, [activityId]);

    return (
        <IonContent>
            <>
                {!displayCreateActivity && !activityIdToDisplay && (
                    <ActivitiesContent
                        onAddActivity={() => setDisplayCreateActivity(true)}
                        onBackPressed={goBack}
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
        </IonContent>
    );
};

export default ActivitiesPage;
