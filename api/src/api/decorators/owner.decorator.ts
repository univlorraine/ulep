import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const OWNER_ALLOWED_KEY = 'owner_allowed';

export const OwnerAllowed = (
  getOwnerIdFromRequest: (request: Request) => string,
) => SetMetadata(OWNER_ALLOWED_KEY, getOwnerIdFromRequest);
