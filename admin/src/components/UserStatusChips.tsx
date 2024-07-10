import { useTranslate } from 'react-admin';
import ColoredChips from './ColoredChips';

type UserStatusChipsProps = {
    status: UserStatus;
};

const UserStatusChips = ({ status }: UserStatusChipsProps) => {
    const translate = useTranslate();

    if (status && status !== 'ACTIVE') {
        return <ColoredChips color="error" label={translate(`global.userStatus.${status.toLowerCase()}`)} />;
    }

    return null;
};

export default UserStatusChips;
