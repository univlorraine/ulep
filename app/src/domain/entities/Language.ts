class Language {
    constructor(public readonly id: string, public readonly code: string, public readonly name: string) {}

    getFlag(): string {
        const flagEmojiRegex = /^[\u{1F1E6}-\u{1F1FF}]{2}$/u;
        const firstFourthChars = this.name.slice(0, 4); // emoji on 4 digits
        if (flagEmojiRegex.test(firstFourthChars)) {
            return firstFourthChars;
        } else {
            return '🌐';
        }
    }
}

export default Language;
