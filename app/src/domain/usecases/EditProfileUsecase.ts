import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import ProfileSignUp from '../entities/ProfileSignUp';
import EditProfileUsecaseInterface from '../interfaces/EditProfileUsecase.interface';

class EditProfileUsecase implements EditProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(profileId: string, payload: ProfileSignUp): Promise<void | Error> {
        try {
            const data = {
                availabilities: payload.availabilities,
                availabilitiesNote: payload.availabilityNote,
                availabilitiesNotePrivate: payload.availabilityNotePrivate,
                biography: {
                    superpower: payload.biography?.power,
                    favoritePlace: payload.biography?.place,
                    experience: payload.biography?.travel,
                    anecdote: payload.biography?.incredible,
                },
                interests: payload.interests,
                masteredLanguageCodes: payload.otherLanguages?.map((language) => language.code),
                meetingFrequency: payload.frequency,
                nativeLanguageCode: payload.nativeLanguage?.code,
                objectives: payload.goals?.map((goal) => goal.id),
            };

            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(
                `/profiles/edit/${profileId}/`,
                data
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            this.setProfile({
                profile: profileCommandToDomain(httpResponse.parsedBody),
            });

            return;
        } catch (err: any) {
            const error = err.error;

            if (!error || !error.statusCode) {
                return new Error('errors.global');
            }

            if (error.statusCode === 401) {
                return new Error('signup_informations_page.error_unauthorized');
            }

            return new Error('errors.global');
        }
    }
}

export default EditProfileUsecase;
