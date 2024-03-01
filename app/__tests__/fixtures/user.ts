import UserResult from "../../src/command/UserResult";

const userResult: UserResult =  {
    id: 'id',
    avatar: { id: 'id', mimeType: 'image/png' },
    acceptsEmail: true,
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    university: {
        id: 'universityId',
        admissionStart: new Date('2023-01-01T00:00:00.000Z'),
        admissionEnd: new Date('2023-12-31T00:00:00.000Z'),
        openServiceDate: new Date('2023-01-01T00:00:00.000Z'),
        closeServiceDate: new Date('2023-01-01T00:00:00.000Z'),
        name: 'name',
        parent: undefined,
        sites: [],
        hasCode: true,
        timezone: 'timezone',
        website: 'site',
        maxTandemsPerUser: 3,
    },
    status: 'ACTIVE',
    staffFunction: 'some job',
    role: "STAFF",
    gender: "MALE",
    division: 'some division',
    diploma: 'some diploma',
    country: 'FR',
    age: 25
};

export default userResult;
