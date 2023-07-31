import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import Profile from '../entities/Profile';
import CreateProfileUsecaseInterface from '../interfaces/CreateProfileUsecase.interface';

class CreateProfileUsecase implements CreateProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(
        age: number,
        role: Role,
        gender: Gender,
        universityId: string,
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
    ): Promise<Profile | Error> {
        try {
            //TODO: Change this later when api will be ready
            const httpRepsonse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(`/profiles/`, {
                age,
                role,
                gender,
                university: universityId,
                nativeLanguage,
                masteredLanguages,
                learningLanguageCode,
                proficiencyLevel: cefrLevel,
                learningType,
                goals,
                meetingFrequency,
                interests,
                preferSameGender,
                bios,
            });

            if (!httpRepsonse.parsedBody) {
                return new Error('errors.global');
            }

            return this.setProfile(profileCommandToDomain(httpRepsonse.parsedBody));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateProfileUsecase;
