import { Inject, Injectable } from '@nestjs/common';
import Device from 'src/core/models/device.model';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/core/ports/user.repository';

export class AddDeviceCommand {
  token: string;
  isAndroid: boolean;
  isIos: boolean;
}

@Injectable()
export class AddDeviceUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, command: AddDeviceCommand) {
    const user = await this.userRepository.ofId(id);

    if (
      command.token &&
      user.devices.find((device) => device.token === command.token)
    ) {
      return;
    }

    return await this.userRepository.addDevice(
      user.id,
      new Device({
        token: command.token,
        isAndroid: command.isAndroid,
        isIos: command.isIos,
      }),
    );
  }
}
