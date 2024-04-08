import React from 'react';
import { getFilteredTabs } from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const UniversitiesTabs = () => <LinkTabs links={getFilteredTabs('universities')} />;

export default UniversitiesTabs;
