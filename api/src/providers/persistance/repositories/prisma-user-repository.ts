import { User } from 'src/core/models/user';
import { UserRepository } from 'src/core/ports/user.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { userMapper } from '../mappers/user.mapper';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(offset?: number, limit?: number): Promise<Collection<User>> {
    const count = await this.prisma.userEntity.count();

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const users = await this.prisma.userEntity.findMany({
      skip: offset,
      take: limit,
    });

    return {
      items: users.map(userMapper),
      totalItems: count,
    };
  }

  async ofId(id: string): Promise<User> {
    const user = await this.prisma.userEntity.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }

  async ofEmail(email: string): Promise<User> {
    const user = await this.prisma.userEntity.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }

  async save(user: User): Promise<void> {
    await this.prisma.userEntity.create({
      data: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.toString()),
      },
    });
  }
}
