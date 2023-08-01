import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import TandemLine from './TandemLine';

interface WaitingTandemListProps {
    onNewTandemAsked: () => void;
    studentId: string;
    tandems: Tandem[];
}

const WaitingTandemList: React.FC<WaitingTandemListProps> = ({ onNewTandemAsked, studentId, tandems }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.waiting_tandem.title')}</span>
            <div>
                {tandems
                    .filter((tandem) => tandem.status !== 'ACTIVE')
                    .map((tandem) => {
                        return (
                            <TandemLine
                                language={tandem.language}
                                profile={tandem.profiles.find((tandemProfile) => tandemProfile.id !== studentId)}
                                status={tandem.status}
                            />
                        );
                    })}
            </div>
            <button className="primary-button margin-top large-margin-bottom" onClick={onNewTandemAsked}>
                {t('home_page.waiting_tandem.button')}
            </button>
        </div>
    );
};

export default WaitingTandemList;
