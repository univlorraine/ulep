declare global {
    type TranslatedLanguage = 'fr' | 'en' | 'zh';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type LanguageStatus = 'PRIMARY' | 'SECONDARY' | 'UNACTIVE';
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
    interface Window {
        REACT_APP_API_URL?: string;
        REACT_APP_SENTRY_DSN?: string;
        REACT_APP_CHAT_URL?: string;
        REACT_APP_SOCKET_CHAT_URL?: string;
        REACT_APP_JITSI_DOMAIN?: string;
        REACT_APP_DEFAULT_TRANSLATION_LANGUAGE?: string;
    }
}

export {};
