import React from 'react';
import { useTranslate } from 'react-admin';
import PageTitle from '../PageTitle';
import getFilteredTabs from './getFilteredTabs';
import LinkTabs from './LinkTabs';

const UniversitiesTabs = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('universities.title')}</PageTitle>
            <LinkTabs links={getFilteredTabs('universities')} />
        </>
    );
};

export default UniversitiesTabs;
