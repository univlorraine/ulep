import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { InstanceRepository } from 'src/core/ports/instance.repository';
import { Instance } from 'src/core/models/Instance.model';
import { instanceMapper } from 'src/providers/persistance/mappers/instance.mapper';

@Injectable()
export class PrismaInstanceRepository implements InstanceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getInstance(): Promise<Instance> {
    const instance = await this.prisma.instance.findFirst({});

    if (!instance) {
      return null;
    }

    return instanceMapper(instance);
  }
  async update(instance: Instance): Promise<Instance> {
    await this.prisma.instance.update({
      where: {
        id: instance.id,
      },
      data: {
        name: instance.name,
        email: instance.email,
        ressource_url: instance.ressourceUrl,
        cgu_url: instance.cguUrl,
        confidentiality_url: instance.confidentialityUrl,
        primary_color: instance.primaryColor,
        primary_background_color: instance.primaryBackgroundColor,
        primary_dark_color: instance.primaryDarkColor,
        secondary_color: instance.secondaryColor,
        secondary_background_color: instance.secondaryBackgroundColor,
        secondary_dark_color: instance.secondaryDarkColor,
        is_in_maintenance: instance.isInMaintenance,
        days_before_closure_notification:
          instance.daysBeforeClosureNotification,
      },
    });

    return instance;
  }
}
