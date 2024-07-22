import React from 'react';
import { FunctionField, useTranslate, Datagrid, List, TextField } from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import User from '../../entities/User';

const SuggestedLanguagesList = () => {
    const translation = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translation('global.firstname')} sortable={false} source="user.firstname" />
                    <TextField label={translation('global.lastname')} sortable={false} source="user.lastname" />
                    <FunctionField
                        label={translation('global.role')}
                        render={(record: { user: User }) => translation(`global.${record.user.role.toLowerCase()}`)}
                        sortable={false}
                        source="user.role"
                    />
                    <TextField label={translation('global.email')} sortable={false} source="user.email" />
                    <FunctionField
                        label={translation('global.language')}
                        render={(record: any) => translation(`languages_code.${record.language.code}`)}
                        sortable={false}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default SuggestedLanguagesList;
