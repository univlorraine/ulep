declare global {
    type CEFR = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    type Gender = 'MALE' | 'FEMALE' | 'OTHER';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type Pedagogy = 'TANDEM' | 'ETANDEM' | 'BOTH';
    type Role = 'STAFF' | 'STUDENT';
    type TandemStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'VALIDATED_BY_ONE_UNIVERSITY';
    type UserStatus = 'ACTIVE' | 'REPORTED' | 'BANNED' | 'CANCELED';
    type AvailabilitiesOptions = 'UNAVAILABLE' | 'AVAILABLE' | 'VERY_AVAILABLE';

    interface Window { // Pour matomo (UL)
        _mtm: any;
    }

    // TODO(industrialization): remove when jitsi lib meet imported with types
    const JitsiMeetJS: any;
}

export {};
