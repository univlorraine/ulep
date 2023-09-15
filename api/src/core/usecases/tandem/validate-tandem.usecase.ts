import { TandemRepository } from '../../ports/tandems.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import {
  LearningLanguage,
  PairingMode,
  Tandem,
  TandemStatus,
} from 'src/core/models';
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

    if (
      tandem.status !== TandemStatus.DRAFT &&
      tandem.status !== TandemStatus.VALIDATED_BY_ONE_UNIVERSITY
    ) {
      throw new Error(
        `Tandem with status ${tandem.status} can't be validated: ${command.id}`,
      );
    }

    const adminUniversityId =
      command.adminUniversityId ??
      (await this.universityRepository.findUniversityCentral()).id;

    const {
      learningLanguagesFromAdminUniversity,
      learningLanguagesNotFromAdminUniversity,
    } = tandem.learningLanguages.reduce<{
      learningLanguagesFromAdminUniversity: LearningLanguage[];
      learningLanguagesNotFromAdminUniversity: LearningLanguage[];
    }>(
      (accumulator, ll) => {
        if (ll.profile.user.university.id === adminUniversityId) {
          accumulator.learningLanguagesFromAdminUniversity.push(ll);
        } else {
          accumulator.learningLanguagesNotFromAdminUniversity.push(ll);
        }
        return accumulator;
      },
      {
        learningLanguagesFromAdminUniversity: [],
        learningLanguagesNotFromAdminUniversity: [],
      },
    );

    let updatedTandem: Tandem;
    if (learningLanguagesFromAdminUniversity.length === 0) {
      // TODO(NOW+1): custom errors ?
      throw new Error(
        'No concerned learning languages is from admin university',
      );
    } else if (
      learningLanguagesFromAdminUniversity.length ===
      tandem.learningLanguages.length
    ) {
      updatedTandem = new Tandem({
        ...tandem,
        status: TandemStatus.ACTIVE,
        universityValidations: [
          ...tandem.universityValidations,
          adminUniversityId,
        ],
      });
    } else {
      if (tandem.status === TandemStatus.VALIDATED_BY_ONE_UNIVERSITY) {
        updatedTandem = new Tandem({
          ...tandem,
          status: TandemStatus.ACTIVE,
          universityValidations: [
            ...tandem.universityValidations,
            adminUniversityId,
          ],
        });
      } else {
        const partnerUniversityPairingMode =
          learningLanguagesNotFromAdminUniversity[0].profile.user.university
            .pairingMode;

        switch (partnerUniversityPairingMode) {
          case PairingMode.MANUAL:
            updatedTandem = new Tandem({
              ...tandem,
              status: TandemStatus.VALIDATED_BY_ONE_UNIVERSITY,
              universityValidations: [
                ...tandem.universityValidations,
                adminUniversityId,
              ],
            });
            break;
          case PairingMode.SEMI_AUTOMATIC:
          case PairingMode.AUTOMATIC:
            updatedTandem = new Tandem({
              ...tandem,
              status: TandemStatus.ACTIVE,
              universityValidations: [
                ...tandem.universityValidations,
                adminUniversityId,
              ],
            });
            break;
          default:
            throw new Error(
              `Unsupported university pairing mode ${partnerUniversityPairingMode}`,
            );
        }
      }
    }

    await this.tandemRepository.update(updatedTandem);
  }
}
