class Session {
    constructor(
        public id: string,
        public tandemId: string,
        public startAt: Date,
        public comment: string,
        public cancelledAt: Date | null
    ) {}
}

export default Session;
