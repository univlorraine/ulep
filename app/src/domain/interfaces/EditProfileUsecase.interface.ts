import ProfileSignUp from '../entities/ProfileSignUp';

interface EditProfileUsecaseInterface {
    execute(profileId: string, payload: ProfileSignUp): Promise<void | Error>;
}
export default EditProfileUsecaseInterface;
