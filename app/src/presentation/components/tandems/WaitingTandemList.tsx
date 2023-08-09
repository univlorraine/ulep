import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import TandemLine from './TandemLine';

interface WaitingTandemListProps {
    onNewTandemAsked: () => void;
    onTandemPressed: (tandem: Tandem) => void;
    studentId: string;
    tandems: Tandem[];
}

const WaitingTandemList: React.FC<WaitingTandemListProps> = ({
    onNewTandemAsked,
    onTandemPressed,
    studentId,
    tandems,
}) => {
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
                                key={tandem.id}
                                language={tandem.language}
                                profile={tandem.partner}
                                onPressed={() => onTandemPressed(tandem)}
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
