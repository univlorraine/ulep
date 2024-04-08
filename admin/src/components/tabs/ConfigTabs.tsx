import React from 'react';
import { useTranslate } from 'react-admin';
import PageTitle from '../PageTitle';
import getFilteredTabs from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const ConfigTabs = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('instance.title')}</PageTitle>
            <LinkTabs links={getFilteredTabs('configuration')} />
        </>
    );
};
export default ConfigTabs;
