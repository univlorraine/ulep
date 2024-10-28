import React from 'react';
import styles from './ReportDetail.module.css';

interface ReportDetailProps {
    title: string;
    text: string;
    isTextStrong?: boolean;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ title, text, isTextStrong }) => {
    return (
        <div className={styles.item}>
            <p className={styles.item_title}>{title}</p>
            <p className={`${styles.item_content} ${isTextStrong ? styles.item_strong : ''}`}>{text}</p>
        </div>
    );
};

export default ReportDetail;
