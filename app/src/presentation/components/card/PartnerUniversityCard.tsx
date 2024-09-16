import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import LearningCard from './LearningCard';
import UniversityCard from './UniversityCard';

interface UniversityCardProps {
    university: University;
    onPress: () => void;
}

const PartnerUniversityCard: React.FC<UniversityCardProps> = ({ university, onPress }) => {
    const { t } = useTranslation();

    return (
        <LearningCard
            title={t('partner_university.title')}
            buttonText={t('partner_university.button') as string}
            onButtonPressed={onPress}
        >
            <UniversityCard university={university} onPress={onPress} />
        </LearningCard>
    );
};

export default PartnerUniversityCard;
