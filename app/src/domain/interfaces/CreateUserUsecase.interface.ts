import University from '../entities/University';

interface CreateUserUsecaseInterface {
    execute(
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        gender: Gender,
        code: string,
        age: number,
        university: University,
        role: Role,
        countryCode: string,
        division?: string,
        diploma?: string,
        staffFunction?: string,
        avatar?: File
    ): Promise<void | Error>;
}
export default CreateUserUsecaseInterface;
