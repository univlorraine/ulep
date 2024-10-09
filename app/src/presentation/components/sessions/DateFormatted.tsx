import { Device } from "@capacitor/device";
import { useEffect, useState } from "react";
import styles from './DateFormatted.module.css';

interface DateFormattedProps {
    date: Date;
}

const DateFormatted: React.FC<DateFormattedProps> = ({ date }) => {
    const [language, setLanguage] = useState<string>();

    useEffect(() => {
        const getLanguage = async () => {
            const languageTag = await Device.getLanguageTag();
            setLanguage(languageTag.value);
        };
        getLanguage();
    }, []);

    return (
        <span className={styles.date}>
            {date.toLocaleDateString(language, {
                'weekday': 'long',
                'day': 'numeric',
                'month': 'long',
                'year': 'numeric',
            })}
        </span>
    );
};

export default DateFormatted;

