export interface UpdateVisioDurationParams {
    learningLanguageId: string;
    roomName: string;
    partnerTandemId: string;
    partnerFirstname: string;
    partnerLastname: string;
}

interface UpdateVisioDurationUsecaseInterface {
    execute(params: UpdateVisioDurationParams): Promise<void | Error>;
}

export default UpdateVisioDurationUsecaseInterface;
