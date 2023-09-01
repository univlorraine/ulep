const isCodeValid = (code: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    return regex.test(code);
};

export default isCodeValid;
