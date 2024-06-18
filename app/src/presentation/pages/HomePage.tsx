import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import ProfileModal from '../components/modals/ProfileModal';
import ReportModal from '../components/modals/ReportModal';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import useLogout from '../hooks/useLogout';
import useGetHomeData from '../hooks/useGetHomeData';
import HomeContent from '../components/contents/HomeContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [displayProfile, setDisplayProfile] = useState<boolean>(false);
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [refresh, setRefresh] = useState<boolean>(false);

    const { tandems, partnerUniversities, error, isLoading } = useGetHomeData(refresh);

    const { handleLogout } = useLogout();

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    const onProfilePressed = () => (isHybrid ? history.push('/profil') : setDisplayProfile(true));

    const onReportPressed = () => (isHybrid ? history.push('/report') : setDisplayReport(true));

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid
            ? setSelectedTandem(tandem)
            : history.push('/tandem-profil', {
                  profile: tandem.partner,
                  language: tandem.learningLanguage,
                  level: tandem.level,
                  pedagogy: tandem.pedagogy,
                  tandemLearningLanguage: tandem.partnerLearningLanguage,
              });

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <HomeContent
                onProfilePressed={onProfilePressed}
                onReportPressed={onReportPressed}
                onTandemPressed={onTandemPressed}
                onValidatedTandemPressed={onValidatedTandemPressed}
                isLoading={isLoading}
                profile={profile}
                tandems={tandems}
                partnerUniversities={partnerUniversities}
            />
        );
    }

    return (
        <OnlineWebLayout profile={profile}>
            <HomeContent
                isLoading={isLoading}
                profile={profile}
                onProfilePressed={onProfilePressed}
                onReportPressed={onReportPressed}
                onTandemPressed={onTandemPressed}
                onValidatedTandemPressed={onValidatedTandemPressed}
                tandems={tandems}
                partnerUniversities={partnerUniversities}
            />
            <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
            <ProfileModal
                isVisible={displayProfile}
                onClose={() => setDisplayProfile(false)}
                onDisconnect={handleLogout}
                onLanguageChange={() => setRefresh(!refresh)}
                profile={profile}
            />
            <TandemStatusModal
                isVisible={
                    !!selectedTandem &&
                    (selectedTandem.status === 'DRAFT' ||
                        selectedTandem.status === 'INACTIVE' ||
                        selectedTandem.status === 'VALIDATED_BY_ONE_UNIVERSITY')
                }
                onClose={() => setSelectedTandem(undefined)}
                onFindNewTandem={() => history.push('pairing/languages')}
                status={selectedTandem?.status}
            />
            <TandemProfileModal
                isVisible={!!selectedTandem && selectedTandem.status === 'ACTIVE'}
                language={selectedTandem?.learningLanguage}
                level={selectedTandem?.level}
                onClose={() => setSelectedTandem(undefined)}
                partnerLearningLanguage={selectedTandem?.partnerLearningLanguage}
                pedagogy={selectedTandem?.pedagogy}
                profile={selectedTandem?.partner}
            />
        </OnlineWebLayout>
    );
};

export default HomePage;
