import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import UniversityCard from './UniversityCard';

interface MyUniversityCardProps {
    university: University;
}

const MyUniversityCard: React.FC<MyUniversityCardProps> = ({ university }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.my_university.title')}</span>
            <UniversityCard university={university} onPress={() => {}} />
        </div>
    );
};

export default MyUniversityCard;
