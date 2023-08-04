import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import CreateProfileUsecaseInterface from '../interfaces/CreateProfileUsecase.interface';

class CreateProfileUsecase implements CreateProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(
        age: number, // TODO(herve): Should be in User entity
        role: Role, // TODO(herve): Should be in User entity
        gender: Gender, // TODO(herve): Should be in User entity
        universityId: string, // TODO(herve): Should be in User entity
        nativeLanguage: string,
        masteredLanguages: string[],
        learningLanguageCode: string,
        cefrLevel: string,
        learningType: Pedagogy,
        goals: string[],
        meetingFrequency: MeetFrequency,
        interests: string[],
        preferSameGender: boolean,
        bios: string[]
    ): Promise<undefined | Error> {
        try {
            //TODO: Change this later when api will be ready
            /*
            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(`/profiles/`, {
                age,
                role,
                gender,
                university: universityId,
                nativeLanguageCode: nativeLanguage,
                masteredLanguageCodes: masteredLanguages,
                learningLanguageCode,
                level: cefrLevel,
                learningType,
                objectives: goals,
                meetingFrequency,
                interests,
                preferSameGender,
                bios,
            });

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return this.setProfile(profileCommandToDomain(httpResponse.parsedBody));*/
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateProfileUsecase;
