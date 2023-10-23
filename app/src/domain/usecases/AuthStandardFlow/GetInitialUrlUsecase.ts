import GetInitialUrlUsecaseInterface from "../../interfaces/AuthStandardFlow/GetInitialUrlUsecase.interface";

export class GetInitialUrlUsecase implements GetInitialUrlUsecaseInterface {
    constructor(private readonly apiUrl: string) {}

    execute(redirectUri: string): string {
        return `${this.apiUrl}/authentication/flow?redirectUri=${redirectUri}`;
    }
}