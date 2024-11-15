import Profile from '../../../../domain/entities/Profile';
import LogEntriesContent from './LogEntriesContent';

interface LearningBookContainerContentProps {
    onClose: () => void;
    profile: Profile;
}

const LearningBookContainerContent: React.FC<LearningBookContainerContentProps> = ({ onClose, profile }) => {
    return (
        <>
            <LogEntriesContent
                onAddCustomLogEntry={() => {}}
                onBackPressed={onClose}
                profile={profile}
                isModal={false}
            />
        </>
    );
};

export default LearningBookContainerContent;
