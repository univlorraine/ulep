import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import { FunctionField, useTranslate, List, Datagrid, TextField, BulkDeleteButton } from 'react-admin';
import UniversitiesTabs from '../../components/tabs/UniversitiesTabs';
import University from '../../entities/University';

const UniversityBulkActionsToolbar = () => <BulkDeleteButton mutationMode="pessimistic" />;

const UniversityList = (props: any) => {
    const translate = useTranslate();

    return (
        <>
            <UniversitiesTabs />
            <List exporter={false} pagination={false} title={translate('universities.label')} {...props}>
                <Datagrid
                    bulkActionButtons={<UniversityBulkActionsToolbar />}
                    isRowSelectable={(record: University) => !!record.parent}
                    rowClick="show"
                >
                    <TextField label={translate('universities.name')} source="name" />
                    <FunctionField
                        label={translate('universities.parent')}
                        render={(record: any) =>
                            record.parent ? (
                                <div />
                            ) : (
                                <div>
                                    <CheckIcon />
                                </div>
                            )
                        }
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default UniversityList;
