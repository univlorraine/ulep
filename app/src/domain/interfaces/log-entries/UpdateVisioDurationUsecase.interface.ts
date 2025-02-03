export interface UpdateVisioDurationParams {
    learningLanguageId: string;
    partnerTandemId: string;
    partnerFirstname: string;
    partnerLastname: string;
}

interface UpdateVisioDurationUsecaseInterface {
    execute(params: UpdateVisioDurationParams): Promise<void | Error>;
}

export default UpdateVisioDurationUsecaseInterface;
