import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { TextContentRelations } from '../mappers/translation.mapper';
import { ReportRepository } from 'src/core/ports/report.repository';
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import {
  ReportRelations,
  reportCategoryMapper,
  reportMapper,
} from '../mappers/report.mapper';

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(report: Report): Promise<Report> {
    await this.prisma.reports.create({
      data: {
        User: {
          connect: {
            id: report.owner,
          },
        },
        Category: {
          connect: {
            id: report.category.id,
          },
        },
        status: report.status,
        content: report.content,
      },
    });

    return report;
  }

  async createCategory(category: ReportCategory): Promise<ReportCategory> {
    await this.prisma.reportCategories.create({
      data: {
        id: category.id,
        TextContent: {
          create: {
            text: category.name.content,
            LanguageCode: { connect: { code: category.name.language } },
          },
        },
      },
    });

    return category;
  }

  async reportsByStatus(status: ReportStatus): Promise<Report[]> {
    const reports = await this.prisma.reports.findMany({
      where: { status: { equals: status } },
      include: {
        User: true,
        Category: {
          include: {
            TextContent: TextContentRelations,
          },
        },
      },
    });

    return reports.map(reportMapper);
  }

  async reportOfId(id: string): Promise<Report> {
    const report = await this.prisma.reports.findUnique({
      where: { id },
      include: ReportRelations,
    });

    if (!report) {
      return null;
    }

    return reportMapper(report);
  }

  async categories(): Promise<Collection<ReportCategory>> {
    const count = await this.prisma.reportCategories.count();

    const reportCategories = await this.prisma.reportCategories.findMany({
      include: {
        TextContent: {
          include: {
            LanguageCode: true,
            Translations: { include: { LanguageCode: true } },
          },
        },
      },
    });

    return new Collection<ReportCategory>({
      items: reportCategories.map(reportCategoryMapper),
      totalItems: count,
    });
  }

  async categoryOfId(id: string): Promise<ReportCategory> {
    const reportCategory = await this.prisma.reportCategories.findUnique({
      where: { id },
      include: { TextContent: TextContentRelations },
    });

    if (!reportCategory) {
      return null;
    }

    return reportCategoryMapper(reportCategory);
  }

  async categoryOfName(name: string): Promise<ReportCategory> {
    const reportCategory = await this.prisma.reportCategories.findFirst({
      where: { TextContent: { text: { equals: name } } },
      include: { TextContent: TextContentRelations },
    });

    if (!reportCategory) {
      return null;
    }

    return reportCategoryMapper(reportCategory);
  }

  async updateReport(id: string, status: ReportStatus): Promise<void> {
    await this.prisma.reports.update({
      where: { id },
      data: { status },
    });
  }

  async updateCategory(id: string, name: string): Promise<void> {
    await this.prisma.reportCategories.update({
      where: { id },
      data: {
        TextContent: { update: { text: name } },
      },
    });
  }

  async deleteReport(instance: Report): Promise<void> {
    await this.prisma.reports.delete({
      where: { id: instance.id },
    });
  }

  async deleteCategory(instance: ReportCategory): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the category.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }
}
