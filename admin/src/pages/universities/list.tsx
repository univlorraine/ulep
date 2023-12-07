import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import { FunctionField, useTranslate, List, Datagrid, TextField } from 'react-admin';
import University from '../../entities/University';

const UniversityList = (props: any) => {
    const translate = useTranslate();

    return (
        <List exporter={false} pagination={false} title={translate('universities.label')} {...props}>
            <Datagrid isRowSelectable={(record: University) => !!record.parent} rowClick="show">
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
    );
};

export default UniversityList;
