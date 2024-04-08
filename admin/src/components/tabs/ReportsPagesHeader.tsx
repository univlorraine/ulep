import React from 'react';
import { useTranslate } from 'react-admin';
import PageTitle from '../PageTitle';
import getFilteredTabs from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const ReportsPagesHeader = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('reports.title')}</PageTitle>
            <LinkTabs links={getFilteredTabs('reports')} />
        </>
    );
};

export default ReportsPagesHeader;
