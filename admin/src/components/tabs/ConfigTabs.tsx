import React from 'react';
import getFilteredTabs from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const ConfigTabs = () => <LinkTabs links={getFilteredTabs('configuration')} />;

export default ConfigTabs;
