import { useState } from 'react';
import { Match } from '../../../../entities/Match';

const useTandemMatchesFilters = (matches: Match[]) => {
    const [firstnameFilter, setFirstnameFilter] = useState<string>();
    const [lastnameFilter, setLastnameFilter] = useState<string>();
    const [roleFilter, setRoleFilter] = useState<UserRole>();
    let filteredMatches = matches || [];
    if (firstnameFilter) {
        filteredMatches = filteredMatches.filter((match) =>
            match.target.profile.user.firstname.toLowerCase().includes(firstnameFilter.toLowerCase())
        );
    }
    // TODO(NOW+1): optimize loop for filtering
    if (lastnameFilter) {
        filteredMatches = filteredMatches.filter((match) =>
            match.target.profile.user.lastname.toLowerCase().includes(lastnameFilter.toLowerCase())
        );
    }
    if (roleFilter) {
        filteredMatches = filteredMatches.filter((match) => match.target.profile.user.role === roleFilter);
    }

    return {
        filteredMatches,
        firstnameFilter,
        setFirstnameFilter,
        lastnameFilter,
        setLastnameFilter,
        roleFilter,
        setRoleFilter,
    };
};

export default useTandemMatchesFilters;
