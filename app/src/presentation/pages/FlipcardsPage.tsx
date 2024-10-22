import { IonContent } from '@ionic/react';
import { useState } from 'react';
import { Redirect, useLocation } from 'react-router';
import { useStoreState } from '../../store/storeTypes';
import OnlineWebLayout from '../components/layout/OnlineWebLayout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import FlipcardsContent from '../components/contents/FlipcardsContent';

type FlipcardsPageProps = {
    selectedListsId: string[];
};

const FlipcardsPage = () => {
    const location = useLocation<FlipcardsPageProps>();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((state) => state.profile);
    const { selectedListsId } = location.state;
    const [refresh, setRefresh] = useState<boolean>(false);
    
    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (isHybrid) {
        return (
            <IonContent>
                <FlipcardsContent 
                    profile={profile}
                    selectedListsId={selectedListsId}
                />
            </IonContent>
        );
    }

    return (
        <>
            <OnlineWebLayout profile={profile} onRefresh={() => setRefresh(!refresh)}>
                <FlipcardsContent 
                    profile={profile}
                    selectedListsId={selectedListsId}
                />
            </OnlineWebLayout>
        </>
    );
};

export default FlipcardsPage;
