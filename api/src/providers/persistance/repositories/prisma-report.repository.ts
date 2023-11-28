import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { TextContentRelations } from '../mappers/translation.mapper';
import {
  ReportQueryOrderBy,
  ReportQueryWhere,
  ReportRepository,
} from 'src/core/ports/report.repository';
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import {
  ReportRelations,
  reportCategoryMapper,
  reportMapper,
} from '../mappers/report.mapper';

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(
    offset?: number,
    limit?: number,
    orderBy?: ReportQueryOrderBy,
    where?: ReportQueryWhere,
  ): Promise<Collection<Report>> {
    const whereQuery = {
      status: where.status ? { equals: where.status } : undefined,
      User: where.universityId
        ? { Organization: { id: where?.universityId } }
        : undefined,
    };
    const count = await this.prisma.reports.count({ where: whereQuery });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    let order;
    if (orderBy.field === 'university') {
      order = { User: { Organization: { name: orderBy.order } } };
    } else if (orderBy.field) {
      order = { User: { [orderBy.field]: orderBy.order } };
    }

    const reports = await this.prisma.reports.findMany({
      where: whereQuery,
      skip: offset,
      orderBy: order,
      take: limit,
      include: ReportRelations,
    });

    return new Collection<Report>({
      items: reports.map(reportMapper),
      totalItems: count,
    });
  }

  async createReport(report: Report): Promise<Report> {
    await this.prisma.reports.create({
      data: {
        User: {
          connect: {
            id: report.user.id,
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
            Translations: {
              create: category.name.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.language } },
              })),
            },
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

  async findReportByUserIdAndCategory(
    userId: string,
    categoryId,
  ): Promise<Report> {
    const report = await this.prisma.reports.findFirst({
      where: { userId, categoryId },
      include: ReportRelations,
    });

    if (!report) {
      return null;
    }

    return reportMapper(report);
  }

  async updateReport(
    id: string,
    status: ReportStatus,
    comment?: string,
  ): Promise<Report> {
    await this.prisma.reports.update({
      where: { id },
      data: { status, comment },
    });

    return this.reportOfId(id);
  }

  async updateCategoryReport(
    category: ReportCategory,
  ): Promise<ReportCategory> {
    await this.prisma.textContent.update({
      where: {
        id: category.name.id,
      },
      data: {
        text: category.name.content,
        LanguageCode: { connect: { code: category.name.language } },
        Translations: {
          deleteMany: {},
          create: category.name.translations?.map((translation) => ({
            text: translation.content,
            LanguageCode: { connect: { code: translation.language } },
          })),
        },
      },
    });

    const updatedCategory = await this.prisma.reportCategories.findUnique({
      where: {
        id: category.id,
      },
      include: { TextContent: TextContentRelations },
    });

    return reportCategoryMapper(updatedCategory);
  }

  async deleteReport(instance: Report): Promise<void> {
    await this.prisma.reports.delete({
      where: { id: instance.id },
    });
  }

  async deleteManyReports(): Promise<void> {
    await this.prisma.reports.deleteMany({
      where: { status: ReportStatus.CLOSED },
    });
  }

  async deleteCategory(instance: ReportCategory): Promise<void> {
    // As we have a foreign key with cascade delete, we don't need to delete the category.
    await this.prisma.textContent.delete({ where: { id: instance.name.id } });
  }
}
