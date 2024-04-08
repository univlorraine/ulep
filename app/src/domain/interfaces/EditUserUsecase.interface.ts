interface EditUserUsecaseInterface {
    execute(
        userId: string,
        age: number,
        email: string,
        firstname: string,
        gender: Gender,
        lastname: string,
        avatar?: File
    ): Promise<void | Error>;
}
export default EditUserUsecaseInterface;
