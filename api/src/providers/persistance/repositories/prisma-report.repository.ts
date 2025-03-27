/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import {
  ReportQueryOrderBy,
  ReportQueryWhere,
  ReportRepository,
} from 'src/core/ports/report.repository';
import {
  reportCategoryMapper,
  reportMapper,
  ReportRelations,
} from '../mappers/report.mapper';
import { TextContentRelations } from '../mappers/translation.mapper';

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
    } else if (orderBy.field === 'firstname' || orderBy.field === 'lastname') {
      order = { User: { [orderBy.field]: orderBy.order } };
    } else if (orderBy.field === 'category') {
      order = {
        Category: {
          TextContent: {
            text: orderBy.order,
          },
        },
      };
    } else if (orderBy.field) {
      order = { [orderBy.field]: orderBy.order };
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
        metadata: report.metadata,
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

  async hasActiveReport(categoryId: string): Promise<boolean> {
    const count = await this.prisma.reports.count({
      where: {
        AND: [
          { Category: { id: categoryId } },
          { status: { in: [ReportStatus.OPEN, ReportStatus.IN_PROGRESS] } },
        ],
      },
    });

    return count > 0;
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

  async findReportsByUser(userId: string): Promise<Report[]> {
    const reports = await this.prisma.reports.findMany({
      where: {
        User: {
          id: userId,
        },
      },
      include: ReportRelations,
      orderBy: {
        createdAt: 'desc',
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
    metadata?: any,
  ): Promise<Report> {
    await this.prisma.reports.update({
      where: { id },
      data: { status, comment, metadata },
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
