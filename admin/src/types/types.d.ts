declare global {
    type TranslatedLanguage = 'fr' | 'en' | 'zh';
    type MeetFrequency =
        | 'ONCE_A_WEEK'
        | 'TWICE_A_WEEK'
        | 'THREE_TIMES_A_WEEK'
        | 'TWICE_A_MONTH'
        | 'THREE_TIMES_A_MONTH';
    type LanguageStatus = 'PRIMARY' | 'SECONDARY' | 'UNACTIVE';
    type UserStatus = 'BANNED' | 'REPORTED' | undefined;
}

export {};
