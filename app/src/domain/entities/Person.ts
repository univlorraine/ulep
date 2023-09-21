
class Person {
    constructor(
        public readonly email: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly age: number,
        public readonly gender: string,
        public readonly role: string,
        public readonly diploma : {
            code: string,
            label: string
        },
        public readonly departement: {
            code: string,
            label: string
        }
    ) {}
}
export default Person