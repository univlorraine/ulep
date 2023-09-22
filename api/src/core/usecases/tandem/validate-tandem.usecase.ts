import { TandemRepository } from '../../ports/tandems.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus } from 'src/core/models';
import { EMAIL_TEMPLATE_IDS } from 'src/core/models/email-content.model';
import {
  EMAIL_TEMPLATE_REPOSITORY,
  EmailTemplateRepository,
} from 'src/core/ports/email-template.repository';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import { TANDEM_REPOSITORY } from 'src/core/ports/tandems.repository';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from 'src/core/ports/university.repository';

interface ValidateTandemCommand {
  id: string;
  adminUniversityId?: string;
}

@Injectable()
export class ValidateTandemUsecase {
  private readonly logger = new Logger(ValidateTandemUsecase.name);

  constructor(
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(EMAIL_TEMPLATE_REPOSITORY)
    private readonly emailTemplateRepository: EmailTemplateRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: ValidateTandemCommand): Promise<void> {
    const tandem = await this.tandemRepository.ofId(command.id);
    if (!tandem) {
      throw new RessourceDoesNotExist();
    }

    if (tandem.status !== TandemStatus.VALIDATED_BY_ONE_UNIVERSITY) {
      throw new DomainError({
        message: `Tandem with status ${tandem.status} can't be validated: ${command.id}`,
      });
    }

    const adminUniversityId =
      command.adminUniversityId ??
      (await this.universityRepository.findUniversityCentral()).id;

    const learningLanguagesFromAdminUniversity =
      tandem.learningLanguages.filter(
        (ll) => ll.profile.user.university.id === adminUniversityId,
      );

    let updatedTandem: Tandem;
    if (learningLanguagesFromAdminUniversity.length === 0) {
      throw new DomainError({
        message: 'No concerned learning languages is from admin university',
      });
    } else if (tandem.universityValidations.includes(adminUniversityId)) {
      throw new DomainError({
        message: 'Admin university has already validated this tandem',
      });
    } else {
      updatedTandem = new Tandem({
        ...tandem,
        status: TandemStatus.ACTIVE,
        universityValidations: [
          ...tandem.universityValidations,
          adminUniversityId,
        ],
      });
    }

    await this.tandemRepository.update(updatedTandem);

    if (updatedTandem.status === TandemStatus.ACTIVE) {
      const [learningLanguage1, learningLanguage2] = tandem.learningLanguages;
      const emailContentProfile1 = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
        learningLanguage1.profile.nativeLanguage.code,
        {
          firstname: learningLanguage1.profile.user.firstname,
          partnerFirstname: learningLanguage2.profile.user.firstname,
          partnerLastname: learningLanguage2.profile.user.lastname,
          universityName: learningLanguage1.profile.user.university.name,
        },
      );
      const emailContentProfile2 = await this.emailTemplateRepository.getEmail(
        EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE,
        learningLanguage2.profile.nativeLanguage.code,
        {
          firstname: learningLanguage2.profile.user.firstname,
          partnerFirstname: learningLanguage1.profile.user.firstname,
          partnerLastname: learningLanguage1.profile.user.lastname,
          universityName: learningLanguage2.profile.user.university.name,
        },
      );
      await this.emailGateway.send({
        recipient: learningLanguage1.profile.user.email,
        email: emailContentProfile1,
      });
      await this.emailGateway.send({
        recipient: learningLanguage2.profile.user.email,
        email: emailContentProfile2,
      });
    }
  }
}
