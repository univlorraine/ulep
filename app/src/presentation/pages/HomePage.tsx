import { IonContent, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import HomeContent from '../components/contents/HomeContent';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import TandemProfileModal from '../components/modals/TandemProfileModal';
import TandemStatusModal from '../components/modals/TandemStatusModal';
import useGetHomeData from '../hooks/useGetHomeData';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [refresh, setRefresh] = useState<boolean>(false);

    const { tandems, partnerUniversities, error, isLoading } = useGetHomeData(refresh);

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    const onReportPressed = () => (isHybrid ? history.push('/report') : undefined);

    const onTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-status', { tandem });

    const onValidatedTandemPressed = (tandem: Tandem) =>
        !isHybrid ? setSelectedTandem(tandem) : history.push('/tandem-profil', { tandem });

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <HomeContent
                    onReportPressed={onReportPressed}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    isLoading={isLoading}
                    profile={profile}
                    tandems={tandems}
                    partnerUniversities={partnerUniversities}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile} onRefresh={() => setRefresh(!refresh)}>
                <HomeContent
                    isLoading={isLoading}
                    profile={profile}
                    onTandemPressed={onTandemPressed}
                    onValidatedTandemPressed={onValidatedTandemPressed}
                    tandems={tandems}
                    partnerUniversities={partnerUniversities}
                />
            </OnlineWebLayout>
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
                id={selectedTandem?.id}
                language={selectedTandem?.learningLanguage}
                level={selectedTandem?.level}
                onClose={() => setSelectedTandem(undefined)}
                partnerLearningLanguage={selectedTandem?.partnerLearningLanguage}
                pedagogy={selectedTandem?.pedagogy}
                profile={selectedTandem?.partner}
            />
        </>
    );
};

export default HomePage;
