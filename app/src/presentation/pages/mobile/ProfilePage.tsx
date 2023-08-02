import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import Profile from '../../../domain/entities/Profile';
import ProfileContent from '../../components/contents/ProfileContent';

//TODO: Change this when create Profile will be done
const profile = new Profile(
    'id',
    'email',
    'firstname',
    'lastname',
    22,
    'MALE',
    'id',
    'STUDENT',
    'FR',
    'CN',
    ['goal'],
    'ONCE_A_WEEK',
    ['interest'],
    ['bios'],
    '/assets/avatar.svg'
);

const ProfilePage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            <ProfileContent
                onClose={() => history.goBack()}
                onDisconnectPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onEditPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onParameterPressed={function (): void {
                    throw new Error('Function not implemented.');
                }}
                profileFirstname={profile.firstname}
                profileLastname={profile.lastname}
                profilePicture={profile.avatar}
            />
        </IonPage>
    );
};

export default ProfilePage;
