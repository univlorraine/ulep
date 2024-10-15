import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListEventsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(query: any) {
    const { skip, take, where } = query;

    return this.prisma.events.findMany({
      skip,
      take,
      where,
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
