import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Edito } from 'src/core/models/edito.model';
import {
  CreateEditoCommand,
  EditoRepository,
} from 'src/core/ports/edito.repository';
import { editoMapper, EditoRelations } from '../mappers/edito.mapper';

@Injectable()
export class PrismaEditoRepository implements EditoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateEditoCommand): Promise<Edito> {
    const edito = await this.prisma.editos.create({
      data: {
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
    });

    return editos.map(editoMapper);
  }
}
