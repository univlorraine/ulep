import { Chip } from '@material-ui/core';
import React from 'react';
import { FunctionField, ArrayField, List, Datagrid, TextField } from 'react-admin';

const InterestCategoryList = () => (
    <List exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="edit">
            <TextField source="name" />
            <ArrayField sortable={false} source="interests">
                <FunctionField
                    render={(record: any) => (
                        <div>
                            {record.interests.map((interest: any) => (
                                <Chip key={interest.id} label={interest.name} style={{ margin: '0 5px 5px 0' }} />
                            ))}
                            <Chip color="default" label="+" style={{ margin: '0 5px 5px 0' }} />
                        </div>
                    )}
                />
            </ArrayField>
        </Datagrid>
    </List>
);

export default InterestCategoryList;
