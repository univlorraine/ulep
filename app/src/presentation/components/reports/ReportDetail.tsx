import React from 'react';
import styles from './ReportDetail.module.css';

interface ReportDetailProps {
    title: string;
    text: string;
    isTextStrong?: boolean;
    isUrl?: boolean;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ title, text, isTextStrong, isUrl }) => {
    return (
        <div className={styles.item}>
            <p className={styles.item_title}>{title}</p>
            {isUrl ? (
                <a
                    href={text}
                    className={`${styles.item_content} ${isTextStrong ? styles.item_strong : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title}: ${text}`}
                >
                    {text}
                </a>
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
