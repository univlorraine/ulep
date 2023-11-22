import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';

const useIsUniversityOpen = (universityId?: string, deps?: any[]) => {
    const [isUniversityOpen, setIsUniversityOpen] = useState<boolean>();
    const [openDate, setOpenDate] = useState<Date>();
    const [closeDate, setCloseDate] = useState<Date>();
    const { getUniversity } = useConfig();

    useEffect(() => {
        const isUniversityOpen = async () => {
            const result = await getUniversity.execute(universityId!);

            if (result instanceof Error) {
                return setIsUniversityOpen(false);
            }
            
            const now = new Date();
            setOpenDate(result.openServiceDate);
            setCloseDate(result.closeServiceDate);
            setIsUniversityOpen(now >= result.openServiceDate && now <= result.closeServiceDate);
        };

        if(universityId) {
            isUniversityOpen();
        }
    }, deps);

    return {openDate, closeDate, isUniversityOpen};
};

export default useIsUniversityOpen;
