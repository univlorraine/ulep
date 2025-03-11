import React from 'react';
import styles from './ReportDetail.module.css';

interface ReportDetailProps {
    title: string;
    text: string;
    isTextStrong?: boolean;
    isUrl?: boolean;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ title, text, isTextStrong, isUrl }) => {
    const extractUrl = (content: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = content.match(urlRegex);
        if (match) {
            const url = match[0];
            const index = content.indexOf(url);
            return {
                before: content.slice(0, index),
                url: url,
                after: content.slice(index + url.length),
            };
        }
        return { before: '', url: content, after: '' };
    };

    const { before, url, after } = extractUrl(text);

    return (
        <div className={styles.item}>
            <p className={styles.item_title}>{title}</p>
            {isUrl ? (
                <p className={styles.item_content}>
                    {before}
                    <a className={styles.url_highlight} href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                    {after}
                </p>
            ) : (
                <p
                    className={`${styles.item_content} ${isTextStrong ? styles.item_strong : ''}`}
                    aria-label={`${title}: ${text}`}
                >
                    {text}
                </p>
            )}
        </div>
    );
};

export default ReportDetail;
