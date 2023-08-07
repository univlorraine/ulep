import { IonPage } from '@ionic/react';
import { Redirect, useHistory } from 'react-router';
import { useStoreState } from '../../../store/storeTypes';
import ProfileContent from '../../components/contents/ProfileContent';

const ProfilePage: React.FC = () => {
    const history = useHistory();
    const profile = useStoreState((state) => state.profile);

    if (!profile) {
        return <Redirect to={'/signup'} />;
    }
    return (
        <IonPage>
            <ProfileContent
                onClose={() => history.goBack()}
                onParameterPressed={() => history.push('/settings')}
                profileFirstname={profile.user.firstname}
                profileLastname={profile.user.lastname}
                profilePicture={profile.user.avatar}
            />
        </IonPage>
    );
};

export default ProfilePage;
