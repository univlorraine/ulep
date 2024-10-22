import { SortDirection } from '@mui/material';
import { useMemo } from 'react';
import { Match } from '../../../../entities/Match';
import compareCEFR from '../../../../utils/compareCEFR';
import { TandemTableFieldToSort } from './TandemTable';

const useSortedTandemMatches = (
    filteredMatches: Match[],
    sortDirection: SortDirection,
    fieldToSort: TandemTableFieldToSort
): Match[] => {
    const sortedMatches = useMemo(
        () =>
            filteredMatches.sort((a, b) => {
                if (fieldToSort === 'level') {
                    return sortDirection === 'asc'
                        ? compareCEFR(b.target.level, a.target.level)
                        : compareCEFR(a.target.level, b.target.level);
                }

                if (fieldToSort === 'age') {
                    return sortDirection === 'asc'
                        ? a.target.profile.user.age - b.target.profile.user.age
                        : b.target.profile.user.age - a.target.profile.user.age;
                }

                if (fieldToSort === 'score') {
                    return sortDirection === 'asc' ? a.score.total - b.score.total : b.score.total - a.score.total;
                }

                if (fieldToSort === 'date') {
                    return sortDirection === 'asc'
                        ? new Date(a.target.createdAt).getTime() - new Date(b.target.createdAt).getTime()
                        : new Date(b.target.createdAt).getTime() - new Date(a.target.createdAt).getTime();
                }

                return 0;
            }),
        [filteredMatches, sortDirection, fieldToSort]
    );

    return sortedMatches;
};

export default useSortedTandemMatches;
