class Question {
    constructor(private readonly _question: string, private readonly _answer: boolean) {}

    get question(): string {
        return this._question;
    }

    get answser(): boolean {
        return this._answer;
    }
}

export default Question;
