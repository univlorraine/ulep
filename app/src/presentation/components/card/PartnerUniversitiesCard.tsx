import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import UniversityCard from './UniversityCard';
import { useState } from 'react';
import styles from './PartnerUniversitiesCard.module.css';

interface UniversityCardProps {
    universities: University[];
}

const PartnerUniversitiesCard: React.FC<UniversityCardProps> = ({ universities }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.partner_universities.title')}</span>
            <UniversityCard university={universities[currentIndex]} />
            <div className={styles['container-button']}>
                {universities.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.button} ${
                            currentIndex === index ? styles['active-button'] : styles['inactive-button']
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PartnerUniversitiesCard;
