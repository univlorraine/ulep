import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Profile, Tandem, TandemStatus, University } from 'src/core/models';
import { EMAIL_GATEWAY, EmailGateway } from 'src/core/ports/email.gateway';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';

export class DeleteProfileCommand {
  id: string;
}

@Injectable()
export class DeleteProfileUsecase {
  private readonly logger = new Logger(DeleteProfileUsecase.name);

  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profilesRepository: ProfileRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(EMAIL_GATEWAY)
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const profile = await this.profilesRepository.ofId(command.id);

    if (!profile) {
      throw new RessourceDoesNotExist();
    }

    await this.deleteTandems(profile);

    await this.profilesRepository.delete(profile);
  }

  private async deleteTandems(profile: Profile) {
    const tandems = await this.tandemRepository.getTandemsForProfile(
      profile.id,
    );

    if (tandems.length > 0) {
      for (const tandem of tandems) {
        await this.tandemRepository.delete(tandem.id);

        if (tandem.status === TandemStatus.ACTIVE) {
          await this.sendTandemCancelledEmail(tandem);
        }
      }
    }
  }

  async sendTandemCancelledEmail(tandem: Tandem) {
    const universities = new Set<University>();
    const profiles = tandem.learningLanguages.map(
      (language) => language.profile,
    );

    for (const profile of profiles) {
      const partner = profiles.find((p) => p.id !== profile.id).user;

      if (profile.user.acceptsEmail) {
        try {
          await this.emailGateway.sendTandemCanceledEmail({
            to: profile.user.email,
            language: profile.nativeLanguage.code,
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to user ${profile.user.id} after tandem cancel: ${error}`,
          );
        }
      }

      if (universities.has(profile.user.university)) {
        continue;
      }

      if (profile.user.university.notificationEmail) {
        try {
          await this.emailGateway.sendTandemCanceledNoticeEmail({
            to: profile.user.university.notificationEmail,
            language: profile.user.university.country.code.toLowerCase(),
            user: { ...profile.user, university: profile.user.university.name },
            partner: { ...partner, university: partner.university.name },
          });
        } catch (error) {
          this.logger.error(
            `Error sending email to university ${profile.user.university.id} after tandem cancel: ${error}`,
          );
        }
      }

      universities.add(profile.user.university);
    }
  }
}
