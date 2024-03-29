interface EditUserUsecaseInterface {
    execute(userId: string, firstname: string, lastname: string, gender: Gender, age: number): Promise<void | Error>;
}
export default EditUserUsecaseInterface;
