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
import { Device, User, UserStatus } from 'src/core/models';
import {
  UpdateUserResponse,
  UserRepository,
  WhereProps,
} from 'src/core/ports/user.repository';
import { UniversityRelations } from '../mappers';
import { UserRelations, userMapper } from '../mappers/user.mapper';

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

  async findByUniversityId(universityId: string): Promise<User[]> {
    const instances = await this.prisma.users.findMany({
      where: {
        organization_id: universityId,
      },
      include: UserRelations,
    });

    const users: User[] = instances.map((item) => userMapper(item));

    return users;
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

  async ofIds(ids: string[]): Promise<User[]> {
    const instances = await this.prisma.users.findMany({
      where: {
        id: { in: ids },
      },
      include: UserRelations,
    });

    return instances.map((item) => userMapper(item));
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
          upsert: {
            where: { token: props.token },
            create: {
              token: props.token,
              is_android: props.isAndroid,
              is_ios: props.isIos,
            },
            update: {
              is_android: props.isAndroid,
              is_ios: props.isIos,
            },
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
