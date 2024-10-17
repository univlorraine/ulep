const compareCEFR = (levelA: string, levelB: string) => {
    const CEFRlevels: { [key: string]: number } = {
        A0: 0,
        A1: 1,
        A2: 2,
        B1: 3,
        B2: 4,
        C1: 5,
        C2: 6,
    };

    return CEFRlevels[levelB] - CEFRlevels[levelA];
};

export default compareCEFR;
