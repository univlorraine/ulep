import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import LanguageCommand, { LanguageAskedCommand, languageCommandToDomain } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import AskForLearningLanguageUsecaseInterface from '../interfaces/AskForLearningLanguageUsecase.interface';

class AskForLearningLanguageUsecase implements AskForLearningLanguageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(
        profileId: string,
        language: Language,
        level: CEFR,
        learningType: Pedagogy,
        sameAge: boolean,
        sameGender: boolean,
        campusId?: string,
        isForCertificate?: boolean,
        isForProgram?: boolean
    ): Promise<Language | Error> {
        try {
            const httpResponse: HttpResponse<LanguageCommand> = await this.domainHttpAdapter.post(
                `/profiles/${profileId}/learning-language`,
                {
                    code: language.code,
                    level,
                    learningType,
                    sameAge,
                    sameGender,
                    campusId,
                    certificateOption: isForCertificate,
                    specificProgram: isForProgram,
                }
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return languageCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AskForLearningLanguageUsecase;
