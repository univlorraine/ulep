import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Instance, UpdateInstanceProps } from 'src/core/models/Instance.model';
import { InstanceRepository } from 'src/core/ports/instance.repository';
import { instanceMapper } from 'src/providers/persistance/mappers/instance.mapper';

@Injectable()
export class PrismaInstanceRepository implements InstanceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getInstance(): Promise<Instance> {
    const instance = await this.prisma.instance.findFirst({
      include: {
        DefaultCertificateFile: true,
        EditoCentralUniversityTranslations: true,
      },
    });

    if (!instance) {
      return null;
    }

    return instanceMapper(instance);
  }
  async update(props: UpdateInstanceProps): Promise<Instance> {
    const instance = await this.prisma.instance.update({
      where: {
        id: props.id,
      },
      data: {
        name: props.name,
        email: props.email,
        ressource_url: props.ressourceUrl,
        cgu_url: props.cguUrl,
        confidentiality_url: props.confidentialityUrl,
        primary_color: props.primaryColor,
        primary_background_color: props.primaryBackgroundColor,
        primary_dark_color: props.primaryDarkColor,
        secondary_color: props.secondaryColor,
        secondary_background_color: props.secondaryBackgroundColor,
        secondary_dark_color: props.secondaryDarkColor,
        is_in_maintenance: props.isInMaintenance,
        days_before_closure_notification: props.daysBeforeClosureNotification,
        edito_mandatory_translations: props.editoMandatoryTranslations || [],
        EditoCentralUniversityTranslations: {
          set: [],
          connect: props.editoCentralUniversityTranslations?.map(
            (translation) => ({
              code: translation,
            }),
          ),
        },
      },
      include: {
        DefaultCertificateFile: true,
        EditoCentralUniversityTranslations: true,
      },
    });

    return instanceMapper(instance);
  }
}
