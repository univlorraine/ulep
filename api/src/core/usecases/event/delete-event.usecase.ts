import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteEventUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(id: string) {
    return this.prisma.events.delete({
      where: { id },
    });
  }
}
