import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import { TandemHistoryRepository } from 'src/core/ports/tandem-history.repository';
import {
  HistorizedTandemRelation,
  historizedTandemMapper,
} from '../mappers/historizedTandem.mapper';

@Injectable()
export class PrismaTandemHistoryRepository implements TandemHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getOtherUserInTandemHistory(
    userId: string,
    tandemHistoryId: string,
  ): Promise<HistorizedTandem> {
    const res = await this.prisma.tandemHistory.findFirst({
      where: {
        user_id: {
          not: userId,
        },
        tandem_id: { equals: tandemHistoryId },
      },
      include: HistorizedTandemRelation,
    });

    return historizedTandemMapper(res);
  }

  async getHistoryTandemFormUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedTandem> {
    const res = await this.prisma.tandemHistory.findFirst({
      where: {
        Language: {
          id: languageId,
        },
        user_id: userId,
      },
      include: HistorizedTandemRelation,
    });

    if (!res) {
      return undefined;
    }

    return historizedTandemMapper(res);
  }

  async getHistorizedTandemForUser(
    userId: string,
  ): Promise<HistorizedTandem[]> {
    const res = await this.prisma.tandemHistory.findMany({
      where: {
        user_id: userId,
      },
      include: HistorizedTandemRelation,
    });
    return res.map(historizedTandemMapper);
  }

  async update(userId: string, email: string): Promise<void> {
    await this.prisma.tandemHistory.updateMany({
      where: { user_id: userId },
      data: {
        user_email: email,
      },
    });
  }
}
