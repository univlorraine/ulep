import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import LearningCard from './LearningCard';
import UniversityCard from './UniversityCard';

interface UniversityCardProps {
    university: University;
    onPress: () => void;
    currentColor?: string;
}

const PartnerUniversityCard: React.FC<UniversityCardProps> = ({ university, onPress, currentColor }) => {
    const { t } = useTranslation();

    return (
        <LearningCard
            title={t('partner_university.title')}
            buttonText={t('partner_university.button') as string}
            onButtonPressed={onPress}
        >
            <UniversityCard university={university} onPress={onPress} currentColor={currentColor} />
        </LearningCard>
    );
};

export default PartnerUniversityCard;
