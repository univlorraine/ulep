const isPasswordValid = (password: string) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    return regex.test(password);
};

export default isPasswordValid;
