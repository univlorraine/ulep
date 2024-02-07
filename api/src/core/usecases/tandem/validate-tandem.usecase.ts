import { TandemRepository } from '../../ports/tandems.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus, User } from 'src/core/models';
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
      if (learningLanguage1.profile.user.acceptsEmail) {
        await this.sendTamdemValidatedEmail({
          language: learningLanguage1.profile.nativeLanguage.code,
          user: learningLanguage1.profile.user,
          partner: learningLanguage2.profile.user,
        });
      }

      if (learningLanguage2.profile.user.acceptsEmail) {
        await this.sendTamdemValidatedEmail({
          language: learningLanguage2.profile.nativeLanguage.code,
          user: learningLanguage2.profile.user,
          partner: learningLanguage1.profile.user,
        });
      }
    }
  }

  private async sendTamdemValidatedEmail(props: {
    language: string;
    user: User;
    partner: User;
  }): Promise<void> {
    try {
      await this.emailGateway.sendNewPartnerEmail({
        to: props.user.email,
        language: props.language,
        user: {
          ...props.user,
          university: props.user.university.name,
        },
        partner: {
          ...props.partner,
          university: props.partner.university.name,
        },
      });
    } catch (error) {
      this.logger.error('Error while sending tandem validated email', error);
    }
  }
}
