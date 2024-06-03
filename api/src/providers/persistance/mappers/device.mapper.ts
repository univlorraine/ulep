import * as Prisma from '@prisma/client';
import { Device } from 'src/core/models';

export type DeviceSnapshot = Prisma.Device;

export const deviceMapper = (snapshot: DeviceSnapshot): Device => {
  return new Device({
    token: snapshot.token,
    isAndroid: snapshot.is_android,
    isIos: snapshot.is_ios,
  });
};
