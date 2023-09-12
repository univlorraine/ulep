import { HttpResponse } from "../../adapter/BaseHttpAdapter";
import { HttpAdapterInterface } from "../../adapter/DomainHttpAdapter";
import { CollectionCommand } from "../../command/CollectionCommand";
import GoalCommand, { goalCommandToDomain } from "../../command/GoalCommand";
import Goal from "../entities/Goal";
import GetAllGoalsUsecaseInterface from "../interfaces/GetAllGoalsUsecase.interface";

class GetAllGoalsUsecase implements GetAllGoalsUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Goal[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<GoalCommand>> =
                await this.domainHttpAdapter.get(`/objectives`);

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error("errors.global");
            }

            return httpResponse.parsedBody.items.map((goal) =>
                goalCommandToDomain(goal)
            );
        } catch (error: any) {
            return new Error("errors.global");
        }
    }
}

export default GetAllGoalsUsecase;
