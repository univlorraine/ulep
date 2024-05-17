declare global {
    type TranslatedLanguage = 'fr' | 'en' | 'zh';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type LanguageStatus = 'PRIMARY' | 'SECONDARY' | 'UNACTIVE';
    type UserStatus = 'CANCELED' | 'BANNED' | 'REPORTED' | undefined;
    type UserRole = 'STUDENT' | 'STAFF';
    type AvailabilitiesOptions = 'UNAVAILABLE' | 'AVAILABLE' | 'VERY_AVAILABLE';
    interface UserIdentity {
        id: Identifier;
        fullName?: string;
        firstName: string;
        lastName: string;
        email?: string;
        avatar?: string;
        [key: string]: any;
    }
}

export {};
