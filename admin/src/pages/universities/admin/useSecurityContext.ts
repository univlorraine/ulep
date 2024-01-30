import { useGetIdentity, useShowController } from 'react-admin';

interface SecurityContext {
    isLoading: boolean;
    isUniversityAdmin?: boolean;
    universityId?: string;
}

export default function useSecurityContext(): SecurityContext {
    const { isLoading, data } = useGetIdentity();
    const { record } = useShowController();

    if (isLoading || !record || !data) return { isLoading: true };

    const { universityId, isCentralUniversity } = data;

    return {
        isLoading: false,
        universityId,
        isUniversityAdmin: !isCentralUniversity && universityId && record.id !== universityId,
    };
}
