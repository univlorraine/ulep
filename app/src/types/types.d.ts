declare global {
    type CEFR = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    type Gender = 'male' | 'female' | 'other';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type Pedagogy = 'TANDEM' | 'ETANDEM' | 'BOTH';
    type Role = 'staff' | 'student';
    type TandemStatus = 'ACTIVE' | 'UNACTIVE' | 'DRAFT' | 'VALIDATED_BY_ONE_UNIVERSITY';
    type UserStatus = 'ACTIVE' | 'REPORTED' | 'BANNED';
    type AvailabilitiesOptions = 'UNAVAILABLE' | 'AVAILABLE' | 'VERY_AVAILABLE';
}

export {};
