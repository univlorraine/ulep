import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import ProfileSignUp, { Availabilites } from '../entities/ProfileSignUp';
import EditProfileUsecaseInterface from '../interfaces/EditProfileUsecase.interface';

interface EditProfilePayload {
    age?: number;
    availabilities?: Availabilites;
    availabilitiesNote?: string;
    availabilitiesNotePrivacy?: boolean;
    biography?: {
        superpower?: string;
        favoritePlace?: string;
        experience?: string;
        anecdote?: string;
    };
    firstname?: string;
    file?: File;
    gender?: Gender;
    interests?: string[];
    lastname?: string;
    masteredLanguageCodes?: string[];
    meetingFrequency?: string;
    nativeLanguageCode?: string;
    objectives?: string[];
}

class EditProfileUsecase implements EditProfileUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(profileId: string, payload: ProfileSignUp): Promise<void | Error> {
        try {
            const body: EditProfilePayload = {
                age: payload.age,
                availabilities: payload.availabilities,
                availabilitiesNote: payload.availabilityNote,
                availabilitiesNotePrivacy: payload.availabilityNotePrivate,
                biography: {
                    superpower: payload.biography?.power,
                    favoritePlace: payload.biography?.place,
                    experience: payload.biography?.travel,
                    anecdote: payload.biography?.incredible,
                },
                firstname: payload.firstname,
                gender: payload.gender,
                interests: payload.interests,
                lastname: payload.lastname,
                masteredLanguageCodes: payload.otherLanguages?.map((language) => language.code),
                meetingFrequency: payload.frequency,
                nativeLanguageCode: payload.nativeLanguage?.code,
                objectives: payload.goals?.map((goal) => goal.id),
            };

            if (payload.profilePicture) {
                body.file = payload.profilePicture;
            }

            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(
                `/profiles/edit/${profileId}/`,
                body,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            this.setProfile({
                user: profileCommandToDomain(httpResponse.parsedBody),
            });

            return;
        } catch (err: any) {
            const error = err.error;

            if (!error || !error.statusCode) {
                return new Error('errors.global');
            }

            if (error.statusCode === 400 && error.message.includes('expected size')) {
                return new Error('signup_informations_page.error_picture_weight');
            }

            if (error.statusCode === 400 && error.message.includes('expected type')) {
                return new Error('signup_informations_page.error_picture_format');
            }

            if (error.statusCode === 401) {
                return new Error('signup_informations_page.error_unauthorized');
            }

            return new Error('errors.global');
        }
    }
}

export default EditProfileUsecase;
