export type DeviceProps = {
  id: string;
  token: string;
  isAndroid: boolean;
  isIos: boolean;
};

export class Device {
  id: string;
  token: string;
  isAndroid: boolean;
  isIos: boolean;

  constructor(props: DeviceProps) {
    this.id = props.id;
    this.token = props.token;
    this.isAndroid = props.isAndroid;
    this.isIos = props.isIos;
  }
}

export default Device;
