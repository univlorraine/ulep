import { useTranslate } from 'react-admin';
import { UserStatus } from '../entities/User';
import ColoredChips from './ColoredChips';

type UserStatusChipsProps = {
    status: UserStatus;
};

const UserStatusChips = ({ status }: UserStatusChipsProps) => {
    const translate = useTranslate();

    if (!status || status === UserStatus.ACTIVE) {
        return null;
    }

    if (status === UserStatus.BANNED) {
        return <ColoredChips color="error" label={translate(`global.userStatus.${status.toLowerCase()}`)} />;
    }

    return null;
};

export default UserStatusChips;
