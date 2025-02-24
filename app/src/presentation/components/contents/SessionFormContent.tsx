import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import HeaderSubContent from '../HeaderSubContent';
import ProfileAvailabilities from '../sessions/ProfileAvailabilities';
import SessionForm from '../sessions/SessionForm';
import styles from './SessionFormContent.module.css';

interface SessionFormContentProps {
    goBack?: () => void;
    isHybrid: boolean;
    profile: Profile;
    tandem: Tandem;
    session?: Session;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
}

export interface SessionFormData {
    id?: string;
    date: Date;
    comment: string;
}

const SessionFormContent: React.FC<SessionFormContentProps> = ({
    goBack,
    tandem,
    session,
    profile,
    onShowSessionPressed,
}) => {
    const { t } = useTranslation();
    const { createSession, updateSession } = useConfig();

    const handleSubmit = async ({ id, date, comment }: SessionFormData) => {
        if (id) {
            const session = await updateSession.execute({
                id,
                startAt: date,
                comment,
            });

            if (session instanceof Error) {
                return;
            }

            onShowSessionPressed(session, tandem);
        } else {
            const session = await createSession.execute({
                startAt: date,
                comment,
                tandemId: tandem.id,
            });

            if (session instanceof Error) {
                return;
            }

            onShowSessionPressed(session, tandem, true);
        }
    };

    return (
        <div className={styles.container}>
            <HeaderSubContent
                title={t(session ? 'session.form.update_title' : 'session.form.create_title', {
                    name: tandem?.partner?.user?.firstname,
                })}
                onBackPressed={() => goBack?.()}
            />
            <div className={styles.content}>
                <ProfileAvailabilities partner={tandem.partner} />
                <SessionForm
                    onSubmit={handleSubmit}
                    onBackPressed={goBack}
                    session={session}
                    profile={profile}
                    partner={tandem.partner}
                />
            </div>
        </div>
    );
};

export default SessionFormContent;
