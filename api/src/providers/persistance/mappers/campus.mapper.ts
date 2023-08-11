import * as Prisma from '@prisma/client';
import { Campus } from 'src/core/models/campus.model';

export type CampusSnapshot = Prisma.Places;

export const campusMapper = (campus: CampusSnapshot): Campus => ({
  id: campus.id,
  name: campus.name,
  universityId: campus.organization_id,
});
