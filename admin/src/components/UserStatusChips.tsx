import { useTranslate } from 'react-admin';
import ColoredChips from './ColoredChips';

type UserStatusChipsProps = {
    status: UserStatus;
};

const UserStatusChips = ({ status }: UserStatusChipsProps) => {
    const translate = useTranslate();

    if (!status || status === 'ACTIVE') {
        return null;
    }

    return <ColoredChips color="error" label={translate(`global.userStatus.${status.toLowerCase()}`)} />;
};

export default UserStatusChips;
