interface GetHistoricEmailPartnerUsecaseInterface {
    execute(userId: string, languageId: string): Promise<string | undefined>;
}
export default GetHistoricEmailPartnerUsecaseInterface;
