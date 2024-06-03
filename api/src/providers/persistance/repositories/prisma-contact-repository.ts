import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { ContactRepository } from 'src/core/ports/contact.repository';
import { Contacts } from '@prisma/client';

@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<Contacts> {
    const contact = await this.prisma.contacts.findUnique({ where: { id } });

    if (!contact) {
      return null;
    }

    return contact;
  }

  async delete(id: string): Promise<void> {
    const contact = await this.ofId(id);

    if (!contact) {
      return;
    }

    // Getting all users that had the current contact with their universities
    const usersWithTheirUniversities = await this.prisma.users.findMany({
      where: { contact_id: id },
      include: {
        Organization: true,
      },
    });

    await this.prisma.organizations.updateMany({
      where: { default_contact_id: id },
      data: { default_contact_id: null },
    });

    // For each user, set new default contact except if the current one is the one we are deleting
    for (const user of usersWithTheirUniversities) {
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          Contact:
            user.Organization.default_contact_id &&
            user.Organization.default_contact_id !== id
              ? {
                  connect: {
                    id: user.Organization.default_contact_id,
                  },
                }
              : undefined,
        },
      });
    }

    await this.prisma.contacts.delete({ where: { id } });
  }
}
