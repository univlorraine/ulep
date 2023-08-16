import { BiographySignUp } from '../entities/ProfileSignUp';

interface CreateProfileUsecaseInterface {
    execute(
        id: string,
        nativeLanguageCode: string,
        masteredLanguageCodes: string[],
        learningLanguageCode: string,
        cefrLevel: string,
        learningType: Pedagogy,
        goals: string[],
        meetingFrequency: MeetFrequency,
        interests: string[],
        preferSameAge: boolean,
        preferSameGender: boolean,
        bios: BiographySignUp,
        isForCertificate: boolean,
        isForProgram: boolean,
        campusId?: string
    ): Promise<undefined | Error>;
}
export default CreateProfileUsecaseInterface;
