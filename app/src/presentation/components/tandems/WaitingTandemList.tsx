import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import TandemLine from './TandemLine';

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
    const hasReachedMaxTandems = profile.learningLanguages.length >= profile.user.university.maxTandemsPerUser;

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
            {profile && !hasReachedMaxTandems && (
                <button
                    aria-label={t('home_page.waiting_tandem.button') as string}
                    className="primary-button margin-top large-margin-bottom"
                    onClick={onNewTandemAsked}
                >
                    {t('home_page.waiting_tandem.button')}
                </button>
            )}
        </div>
    );
};

export default WaitingTandemList;
