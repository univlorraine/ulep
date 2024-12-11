import { useState } from 'react';
import { Redirect } from 'react-router';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import ActivitiesContainerContent from '../contents/activity/ActivitiesContainerContent';
import VocabularyContent from '../contents/VocabularyContent';
import TandemProfileContent from '../tandems/TandemProfileContent';
import VisioFrameMenu from './VisioFrameMenu';
import styles from './VisioInfoFrame.module.css';
import VisioWelcomeContent from './VisioWelcomeContent';

type VisioInfoFrameProps = {
    tandem: Tandem | undefined;
};

const VisioInfoFrame: React.FC<VisioInfoFrameProps> = ({ tandem }) => {
    const profile = useStoreState((state) => state.profile);
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('home');

    if (!profile) {
        return <Redirect to={'/'} />;
    }
    return (
        <div className={styles.container}>
            <VisioFrameMenu
                onMenuItemPress={setSelectedMenuItem}
                selectedMenuItem={selectedMenuItem}
                tandemName={tandem?.partner?.user.firstname}
            />
            <div className={styles.content}>
                {selectedMenuItem === 'home' && <VisioWelcomeContent setSelectedMenuItem={setSelectedMenuItem} />}
                {selectedMenuItem === 'vocabulary' && tandem?.learningLanguage && (
                    <VocabularyContent
                        profile={profile}
                        onClose={() => {}}
                        isModal={false}
                        currentLearningLanguage={tandem.learningLanguage}
                    />
                )}
                {selectedMenuItem === 'activity' && (
                    <ActivitiesContainerContent onClose={() => {}} profile={profile} isModal={false} />
                )}
                {tandem && tandem.partner && selectedMenuItem === 'profile' && (
                    <TandemProfileContent
                        learningLanguage={tandem.learningLanguage}
                        level={tandem.level}
                        pedagogy={tandem.pedagogy}
                        partnerProfile={tandem.partner}
                        partnerLearningLanguage={tandem.partnerLearningLanguage}
                        className={styles.tandemContent}
                    />
                )}
            </div>
        </div>
    );
};

export default VisioInfoFrame;
