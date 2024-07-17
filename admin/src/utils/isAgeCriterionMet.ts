const isAgeCriterionMet = (userAge: number, tandemAge: number) => {
    if (userAge < 30) {
        return Math.abs(userAge - tandemAge) <= 5;
    }
    if (userAge < 50) {
        return Math.abs(userAge - tandemAge) <= 10;
    }

    return tandemAge >= 40;
};

export default isAgeCriterionMet;
