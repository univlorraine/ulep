import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import { BiographySignUp } from '../entities/ProfileSignUp';
import CreateProfileUsecaseInterface from '../interfaces/CreateProfileUsecase.interface';

class CreateProfileUsecase implements CreateProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(
        nativeLanguage: string,
        masteredLanguages: string[],
        learningLanguageCode: string,
        cefrLevel: string,
        learningType: Pedagogy,
        goals: string[],
        meetingFrequency: MeetFrequency,
        interests: string[],
        preferSameAge: boolean,
        preferSameGender: boolean,
        biography: BiographySignUp,
        isForCertificate: boolean,
        isForProgram: boolean,
        campusId?: string
    ): Promise<undefined | Error> {
        try {
            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(`/profiles/`, {
                nativeLanguageCode: nativeLanguage,
                masteredLanguageCodes: masteredLanguages,
                learningLanguages: [{ code: learningLanguageCode, level: cefrLevel }],
                learningType,
                objectives: goals,
                meetingFrequency,
                interests,
                sameAge: preferSameAge,
                sameGender: preferSameGender,
                biography: {
                    superpower: biography.power,
                    favoritePlace: biography.place,
                    experience: biography.travel,
                    anecdote: biography.incredible,
                },
                campusId: campusId,
                certificateOption: isForCertificate,
                specificProgram: isForProgram,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const profile = profileCommandToDomain(httpResponse.parsedBody);

            return await this.setProfile({ profile });
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateProfileUsecase;
