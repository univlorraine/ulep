import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Edito } from 'src/core/models/edito.model';
import {
  CreateEditoCommand,
  EditoRepository,
  UpdateEditoCommand,
} from 'src/core/ports/edito.repository';
import { editoMapper, EditoRelations } from '../mappers/edito.mapper';

@Injectable()
export class PrismaEditoRepository implements EditoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateEditoCommand): Promise<Edito> {
    const edito = await this.prisma.editos.create({
      data: {
        id: command.universityId,
        ContentTextContent: {
          create: {
            text: '',
            LanguageCode: { connect: { code: command.defaultLanguageCode } },
            Translations: {
              create: command.translationsLanguageCodes.map((languageCode) => ({
                text: '',
                LanguageCode: { connect: { code: languageCode } },
              })),
            },
          },
        },
        University: {
          connect: {
            id: command.universityId,
          },
        },
      },
      include: EditoRelations,
    });

    return editoMapper(edito);
  }

  async findAll(): Promise<Edito[]> {
    const editos = await this.prisma.editos.findMany({
      include: EditoRelations,
      orderBy: {
        updated_at: 'desc',
      },
    });

    return editos.map(editoMapper);
  }

  async findById(id: string): Promise<Edito> {
    const edito = await this.prisma.editos.findUnique({
      where: { id },
      include: EditoRelations,
    });

    return editoMapper(edito);
  }

  async update(command: UpdateEditoCommand): Promise<Edito> {
    const edito = await this.prisma.editos.update({
      where: { id: command.id },
      data: {
        ContentTextContent: {
          update: {
            text: command.content,
            LanguageCode: { connect: { code: command.languageCode } },
            Translations: {
              deleteMany: {},
              create: command.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.languageCode } },
              })),
            },
          },
        },
      },
      include: EditoRelations,
    });

    return editoMapper(edito);
  }
}
