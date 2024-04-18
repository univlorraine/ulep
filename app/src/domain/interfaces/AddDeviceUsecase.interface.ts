interface AddDeviceUsecaseInterface {
    execute(token: string, isAndroid: boolean, isIos: boolean): Promise<Error | void>;
}

export default AddDeviceUsecaseInterface;
