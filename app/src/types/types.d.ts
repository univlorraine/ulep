declare global {
    type Gender = 'MALE' | 'FEMALE' | 'OTHER';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type Pedagogy = 'TANDEM' | 'ETANDEM' | 'BOTH';
    type Role = 'STAFF' | 'STUDENT';
}

export {};
