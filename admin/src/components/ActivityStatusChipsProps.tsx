import { useTranslate } from 'react-admin';
import { ActivityStatus } from '../entities/Activity';
import ColoredChips from './ColoredChips';

type ActivityStatusChipsProps = {
    status: ActivityStatus;
};

const ActivityStatusChips = ({ status }: ActivityStatusChipsProps) => {
    const translate = useTranslate();

    if (status === ActivityStatus.DRAFT) {
        return <ColoredChips color="primary" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.IN_VALIDATION) {
        return <ColoredChips color="info" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.REJECTED) {
        return <ColoredChips color="error" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    if (status === ActivityStatus.PUBLISHED) {
        return <ColoredChips color="success" label={translate(`activities.status.${status.toLowerCase()}`)} />;
    }

    return null;
};

export default ActivityStatusChips;
