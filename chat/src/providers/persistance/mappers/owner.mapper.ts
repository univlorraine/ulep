import { Prisma } from '@prisma/client';
import { Owner } from 'src/core/models/owner.model';

const OwnerInclude = Prisma.validator<Prisma.OwnerInclude>();

export const OwnerRelations = { include: OwnerInclude };

export type OwnerSnapshot = Prisma.OwnerGetPayload<typeof OwnerRelations>;

export const ownerMapper = (snapshot: OwnerSnapshot): Owner => {
    return new Owner({
        id: snapshot.id,
        name: snapshot.name,
        image: snapshot.image,
    });
};
