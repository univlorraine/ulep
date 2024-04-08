import React from 'react';
import { getFilteredTabs } from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const ReportsTabs = () => <LinkTabs links={getFilteredTabs('reports')} />;

export default ReportsTabs;
