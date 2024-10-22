import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import Report from '../../domain/entities/Report';
import { useStoreState } from '../../store/storeTypes';

const useGetReport = (reportId: string, refreshReport: boolean) => {
    const { getReport } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [reportResult, setReportResult] = useState<{
        report: Report | undefined;
        error: Error | undefined;
        isLoading: boolean;
    }>({
        report: undefined,
        error: undefined,
        isLoading: false,
    });

    if (!profile) return reportResult;

    useEffect(() => {
        const fetchData = async () => {
            setReportResult({
                ...reportResult,
                isLoading: true,
            });
            const result = await getReport.execute(reportId);

            if (result instanceof Error) {
                setReportResult({ report: undefined, error: result, isLoading: false });
            } else {
                setReportResult({ report: result, error: undefined, isLoading: false });
            }
        };

        fetchData();
    }, [profile, refreshReport]);

    return reportResult;
};

export default useGetReport;
