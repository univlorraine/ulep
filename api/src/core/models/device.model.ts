export type DeviceProps = {
  token: string;
  isAndroid: boolean;
  isIos: boolean;
};

export class Device {
  token: string;
  isAndroid: boolean;
  isIos: boolean;

  constructor(props: DeviceProps) {
    this.token = props.token;
    this.isAndroid = props.isAndroid;
    this.isIos = props.isIos;
  }
}

export default Device;
