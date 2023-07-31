interface CreateProfileUsecaseInterface {
    execute(
        age: number,
        role: Role,
        gender: Gender,
        universityId: string,
        nativeLanguage: string,
        masteredLanguages: string[],
        learningLanguageCode: string,
        cefrLevel: string,
        learningType: Pedagogy,
        goals: string[],
        meetingFrequency: MeetFrequency,
        interests: string[],
        preferSameGender: boolean,
        bios: string[]
    ): Promise<undefined | Error>;
}
export default CreateProfileUsecaseInterface;
