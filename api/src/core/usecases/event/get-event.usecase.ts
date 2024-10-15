import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEventUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(id: string) {
    return this.prisma.events.findUnique({
      where: { id },
      include: {
        DiffusionLanguages: true,
        ConcernedUniversities: true,
        AuthorUniversity: true,
        Image: true,
        TitleTextContent: true,
        ContentTextContent: true,
      },
    });
  }
}
