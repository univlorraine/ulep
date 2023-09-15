import { TandemRepository } from '../../ports/tandems.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainError, RessourceDoesNotExist } from 'src/core/errors';
import { Tandem, TandemStatus } from 'src/core/models';
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
      // TODO(NOW+1): custom errors ?
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
  }
}
