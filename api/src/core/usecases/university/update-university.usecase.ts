import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { PairingMode, University } from 'src/core/models';
import { CHAT_SERVICE } from 'src/core/ports/chat.service';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from 'src/core/ports/country.repository';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepository,
} from 'src/core/ports/language.repository';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import {
  TANDEM_REPOSITORY,
  TandemRepository,
} from 'src/core/ports/tandem.repository';
import { ChatService } from 'src/providers/services/chat.service';
import {
  UNIVERSITY_REPOSITORY,
  UniversityRepository,
} from '../../ports/university.repository';

export class UpdateUniversityCommand {
  id: string;
  name: string;
  countryId: string;
  timezone: string;
  admissionEnd: Date;
  admissionStart: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  codes: string[];
  domains: string[];
  website: string;
  pairingMode: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailableIds: string[];
  nativeLanguageId: string;
  defaultContactId?: string;
}

@Injectable()
export class UpdateUniversityUsecase {
  private readonly logger = new Logger(UpdateUniversityUsecase.name);

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(UNIVERSITY_REPOSITORY)
    private readonly universityRepository: UniversityRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatService,
  ) {}

  async execute(command: UpdateUniversityCommand) {
    this.logger.log(JSON.stringify(command));
    const university = await this.universityRepository.ofId(command.id);
    if (!university) {
      throw new RessourceDoesNotExist();
    }

    let specificLanguagesAvailable = [];
    if (command.specificLanguagesAvailableIds) {
      specificLanguagesAvailable = await Promise.all(
        command.specificLanguagesAvailableIds.map((id) =>
          this.languageRepository.ofId(id),
        ),
      );

      if (specificLanguagesAvailable.some((language) => !language)) {
        throw new RessourceDoesNotExist(
          'One or more specified language IDs do not exist.',
        );
      }
    }

    const nativeLanguage = await this.languageRepository.ofId(
      command.nativeLanguageId,
    );
    if (!nativeLanguage) {
      throw new RessourceDoesNotExist('Native language does not exist');
    }

    const country = await this.countryRepository.ofId(command.countryId);
    if (!country) {
      throw new RessourceDoesNotExist('Country does not exist');
    }

    const universityToUpdate = new University({
      id: university.id,
      name: command.name,
      country,
      codes: command.codes || [],
      domains: command.domains || [],
      timezone: command.timezone,
      admissionEnd: command.admissionEnd,
      admissionStart: command.admissionStart,
      openServiceDate: command.openServiceDate,
      closeServiceDate: command.closeServiceDate,
      campus: university.campus,
      website: command.website,
      pairingMode: command.pairingMode,
      maxTandemsPerUser: command.maxTandemsPerUser,
      notificationEmail: command.notificationEmail,
      specificLanguagesAvailable,
      nativeLanguage,
      defaultContactId: command.defaultContactId || university.defaultContactId,
    });

    const { university: updatedUniversity, usersId } =
      await this.universityRepository.update(universityToUpdate);

    await this.handleConversation(
      updatedUniversity,
      university.defaultContactId,
      usersId,
    );

    return new University(updatedUniversity);
  }

  private async handleConversation(
    university: University,
    oldContactId: string,
    usersToUpdate: string[],
  ) {
    if (oldContactId !== university.defaultContactId) {
      const profileAdmin = await this.profileRepository.ofUser(oldContactId);

      let chatIdsToIgnore = [];
      if (profileAdmin) {
        chatIdsToIgnore = await this.tandemRepository.getTandemsForProfile(
          profileAdmin.id,
        );
      }
      await this.chatService.deleteConversationByContactId(
        oldContactId,
        chatIdsToIgnore.map((tandem) => tandem.id),
      );
      await this.chatService.createConversations(
        usersToUpdate
          .filter((userId) => userId !== university.defaultContactId)
          .map((userId) => ({
            participants: [userId, university.defaultContactId],
          })),
      );
    }
  }
}
