import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { UserRelations, userMapper } from '../mappers/user.mapper';
import {
  UpdateUserResponse,
  UserRepository,
  WhereProps,
} from 'src/core/ports/user.repository';
import { Device, User, UserStatus } from 'src/core/models';
import { UniversityRelations } from '../mappers';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data: any = {
      id: user.id,
      Organization: { connect: { id: user.university.id } },
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      gender: user.gender,
      role: user.role,
      diploma: user.diploma,
      division: user.division,
      staff_function: user.staffFunction,
      Nationality: { connect: { id: user.country.id } },
      deactivated_reason: user.deactivatedReason,
    };

    if (user.contactId) {
      data.Contact = { connect: { id: user.contactId } };
    }
    const instance = await this.prisma.users.create({
      data,
      include: {
        Contact: true,
        Organization: { include: UniversityRelations },
        Nationality: true,
        Avatar: true,
      },
    });

    return userMapper(instance);
  }

  async findAll(offset?: number, limit?: number): Promise<Collection<User>> {
    const count = await this.prisma.users.count();

    // If skip is out of range, return an empty array
    if (offset && offset >= count) {
      return { items: [], totalItems: count };
    }

    const instances = await this.prisma.users.findMany({
      skip: offset,
      take: limit,
      include: UserRelations,
    });

    const users: User[] = instances.map((item) => userMapper(item));

    return { items: users, totalItems: count };
  }

  async ofId(id: string): Promise<User | null> {
    const instance = await this.prisma.users.findUnique({
      where: {
        id,
      },
      include: UserRelations,
    });

    if (!instance) {
      return null;
    }

    return userMapper(instance);
  }

  async ofStatus(status: UserStatus): Promise<User[]> {
    const instances = await this.prisma.users.findMany({
      where: {
        status: status.toString(),
      },
      include: UserRelations,
    });

    return instances.map((item) => userMapper(item));
  }

  async update(user: User): Promise<UpdateUserResponse> {
    const data: any = {
      Organization: { connect: { id: user.university.id } },
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      gender: user.gender,
      role: user.role,
      Nationality: { connect: { id: user.country.id } },
      status: user.status,
      deactivated_reason: user.deactivatedReason,
      accepts_email: user.acceptsEmail,
    };

    if (user.contactId) {
      data.Contact = {
        connectOrCreate: {
          where: { id: user.contactId },
          create: {
            id: user.contactId,
          },
        },
      };
      //TODO : Create conversation with user and contact
    }

    await this.prisma.users.update({
      where: { id: user.id },
      data,
    });

    const updatedUser = await this.prisma.users.findUnique({
      where: {
        id: user.id,
      },
      include: UserRelations,
    });

    return {
      user: userMapper(updatedUser),
      newContactId: user.contactId,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.users.deleteMany({});
  }

  async blacklist(users: User[]): Promise<void> {
    await this.prisma.blacklist.deleteMany();

    await this.prisma.blacklist.createMany({
      data: users.map((user) => ({
        user_id: user.id,
        email: user.email,
      })),
    });
  }

  async isBlacklisted(email: string): Promise<boolean> {
    const blacklist = await this.prisma.blacklist.findMany();
    return blacklist.some((it) => it.email === email);
  }

  async count(props: WhereProps): Promise<number> {
    const countUsers = await this.prisma.users.count({
      where: {
        organization_id: props.universityId,
      },
    });

    return countUsers;
  }

  async addDevice(id: string, props: Device): Promise<void> {
    await this.prisma.users.update({
      where: { id },
      data: {
        Devices: {
          create: {
            token: props.token,
            is_android: props.isAndroid,
            is_ios: props.isIos,
          },
        },
      },
    });
  }

  async removeDevice(token: string): Promise<void> {
    await this.prisma.device.delete({
      where: { token },
    });
  }
}
