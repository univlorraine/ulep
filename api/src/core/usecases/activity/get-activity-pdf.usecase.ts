import { KeycloakUser } from '@app/keycloak';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import { PdfServicePort, PDF_SERVICE } from 'src/core/ports/pdf.service';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';

@Injectable()
export class GetActivityPdfUsecase {
  constructor(
    @Inject(PDF_SERVICE)
    private readonly pdfService: PdfServicePort,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(id: string, user: KeycloakUser) {
    const activity = await this.activityRepository.ofId(id);

    if (!activity) {
      throw new RessourceDoesNotExist('Activity does not exist');
    }

    const profile = await this.profileRepository.ofUser(user.sub);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const pdf = await this.pdfService.createActivityPdf(
      activity,
      this.storage,
      profile.nativeLanguage.code,
    );

    return pdf;
  }
}
