import { useState } from 'react';
import { Match } from '../../../../entities/Match';
import { UserRole } from '../../../../entities/User';

const useTandemMatchesFilters = (matches: Match[]) => {
    const [firstnameFilter, setFirstnameFilter] = useState<string>();
    const [lastnameFilter, setLastnameFilter] = useState<string>();
    const [roleFilter, setRoleFilter] = useState<UserRole>();
    const [universityIdFilter, setUniversityIdFilter] = useState<string>();

    const filteredMatches =
        firstnameFilter || lastnameFilter || roleFilter || universityIdFilter
            ? matches.filter((match) => {
                  if (
                      firstnameFilter &&
                      !match.target.profile.user.firstname.toLowerCase().includes(firstnameFilter.toLowerCase())
                  ) {
                      return false;
                  }
                  if (
                      lastnameFilter &&
                      !match.target.profile.user.lastname.toLowerCase().includes(lastnameFilter.toLowerCase())
                  ) {
                      return false;
                  }
                  if (roleFilter && match.target.profile.user.role !== roleFilter) {
                      return false;
                  }
                  if (universityIdFilter && match.target.profile.user.university.id !== universityIdFilter) {
                      return false;
                  }

                  return true;
              })
            : matches;

    return {
        filteredMatches,
        firstnameFilter,
        setFirstnameFilter,
        lastnameFilter,
        setLastnameFilter,
        roleFilter,
        setRoleFilter,
        universityIdFilter,
        setUniversityIdFilter,
    };
};

export default useTandemMatchesFilters;
