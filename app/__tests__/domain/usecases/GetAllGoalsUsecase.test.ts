import { CollectionCommand } from "../../../src/command/CollectionCommand";
import GoalCommand from "../../../src/command/GoalCommand";
import Goal from "../../../src/domain/entities/Goal";
import GetAllGoalsUsecase from "../../../src/domain/usecases/GetAllGoalsUsecase";
import DomainHttpAdapter from "../../mocks/adapters/HttpAdapter";

const usecaseResponse: CollectionCommand<GoalCommand> = {
    items: [{ id: "id", name: "name", image: { id: "id", url: "url" } }],
    totalItems: 1,
};

describe("getAllGoals", () => {
    let adapter: DomainHttpAdapter;
    let usecase: GetAllGoalsUsecase;
    beforeAll(() => {
        adapter = new DomainHttpAdapter();
        usecase = new GetAllGoalsUsecase(adapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("execute function must call DomainHttpAdapter with specific path and params", async () => {
        expect.assertions(2);
        jest.spyOn(adapter, "get");
        adapter.mockJson({ parsedBody: usecaseResponse });
        await usecase.execute();
        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(adapter.get).toHaveBeenCalledWith("/objectives");
    });

    it("execute must return an expected response", async () => {
        expect.assertions(1);

        adapter.mockJson({ parsedBody: usecaseResponse });

        const result = (await usecase.execute()) as Goal[];
        expect(result).toHaveLength(1);
    });

    it("execute must return an expected response without parsed body", async () => {
        expect.assertions(1);

        adapter.mockJson({});

        const result = await usecase.execute();
        expect(result).toBeInstanceOf(Error);
    });

    it("execute must return an error if adapter return an error without status", async () => {
        expect.assertions(1);
        adapter.mockError({});
        const result = await usecase.execute();
        expect(result).toStrictEqual(new Error("errors.global"));
    });
});
