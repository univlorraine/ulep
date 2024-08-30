import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import UniversityCard from './UniversityCard';

interface UniversityCardProps {
    university: University;
    onPress: () => void;
}

const PartnerUniversityCard: React.FC<UniversityCardProps> = ({ university, onPress }) => {
    const { t } = useTranslation();

    return (
        <div className="home-card">
            <span className="home-card-title">{t('partner_university.title')}</span>
            <UniversityCard university={university} onPress={onPress} />
        </div>
    );
};

export default PartnerUniversityCard;
