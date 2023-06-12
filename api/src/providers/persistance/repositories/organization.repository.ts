import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string) {
    const organization = await this.prisma.organization.create({
      data: {
        name: name,
      },
    });

    return organization;
  }

  async findAll() {
    const organizations = await this.prisma.organization.findMany();

    return organizations;
  }
}
