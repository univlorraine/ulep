import { PrismaService } from '../prisma.service';
import { Report, ReportCategory } from '../../../core/models/report';
import { ReportRepository } from '../../../core/ports/report.repository';
import { reportMapper } from '../mappers/report.mapper';
import { StringFilter } from '../../../shared/types/filters';
import { Collection } from 'src/shared/types/collection';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  private readonly logger = new Logger(PrismaReportRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { category: true },
    });

    return reportMapper(report);
  }

  async where(
    offset?: number,
    limit?: number,
    category?: { name: StringFilter },
  ): Promise<Collection<Report>> {
    const count = await this.prisma.report.count({
      where: { category },
    });

    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const reports = await this.prisma.report.findMany({
      skip: offset,
      take: limit,
      where: { category },
      include: { category: true },
    });

    return { items: reports.map(reportMapper), totalItems: count };
  }

  async save(report: Report): Promise<void> {
    await this.prisma.report.create({
      data: {
        id: report.id,
        content: report.content,
        category: {
          connect: {
            id: report.category.id,
          },
        },
        user: {
          connect: {
            id: report.ownerId,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({ where: { id } });
  }

  async categories(): Promise<ReportCategory[]> {
    const categories = await this.prisma.reportCategory.findMany();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async categoryOfId(id: string): Promise<ReportCategory | null> {
    const category = await this.prisma.reportCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
    };
  }

  async categoryOfName(name: string): Promise<ReportCategory | null> {
    const category = await this.prisma.reportCategory.findUnique({
      where: { name },
    });

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
    };
  }

  async createCategory(name: string): Promise<string> {
    const category = await this.prisma.reportCategory.create({
      data: {
        name,
      },
    });

    return category.name;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.reportCategory.delete({ where: { id } });
  }
}
