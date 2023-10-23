import { Availabilites, BiographySignUp } from '../entities/ProfileSignUp';

interface CreateProfileUsecaseInterface {
    execute(
        nativeLanguageCode: string,
        masteredLanguageCodes: string[],
        goals: string[],
        meetingFrequency: MeetFrequency,
        interests: string[],
        bios: BiographySignUp,
        availabilities: Availabilites,
        availabilitiesNote?: string,
        availabilitiesNotePrivacy?: boolean
    ): Promise<undefined | Error>;
}
export default CreateProfileUsecaseInterface;
