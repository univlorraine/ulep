import { useTranslation } from 'react-i18next';
import Tandem from '../../../domain/entities/Tandem';
import TandemLine from './TandemLine';
import { useStoreState } from '../../../store/storeTypes';
import Profile from '../../../domain/entities/Profile';

interface WaitingTandemListProps {
    onNewTandemAsked: () => void;
    onTandemPressed: (tandem: Tandem) => void;
    profile: Profile;
    tandems: Tandem[];
}

const WaitingTandemList: React.FC<WaitingTandemListProps> = ({
    onNewTandemAsked,
    onTandemPressed,
    profile,
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
                                language={tandem.learningLanguage}
                                profile={tandem.partner}
                                onPressed={() => onTandemPressed(tandem)}
                                status={tandem.status}
                            />
                        );
                    })}
            </div>
            {profile && profile.learningLanguages.length < 3 && (
                <button className="primary-button margin-top large-margin-bottom" onClick={onNewTandemAsked}>
                    {t('home_page.waiting_tandem.button')}
                </button>
            )}
        </div>
    );
};

export default WaitingTandemList;
