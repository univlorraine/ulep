import { Chip } from '@material-ui/core';
import React from 'react';
import { useTranslate } from 'react-admin';
import { FunctionField, ArrayField, List, Datagrid, TextField } from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import InterestCategory from '../../entities/InterestCategory';

const InterestCategoryList = () => {
    const translation = useTranslate();
    const navigate = useNavigate();

    return (
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translation('interest_categories.name')} source="name" />
                <ArrayField label={translation('interest_categories.interests')} sortable={false} source="interests">
                    <FunctionField
                        render={(record: InterestCategory) => {
                            return (
                                <div>
                                    {record.interests.map((interest: any) => (
                                        <Link key={interest.id} to={`/interests/${interest.id}/show`}>
                                            <Chip
                                                key={interest.id}
                                                label={interest.name}
                                                style={{ margin: '0 5px 5px 0' }}
                                            />
                                        </Link>
                                    ))}
                                    <span
                                        onClick={() =>
                                            navigate('/interests/create', { state: { category: record.id } })
                                        }
                                    >
                                        <Chip color="default" label="+" style={{ margin: '0 5px 5px 0' }} />
                                    </span>
                                </div>
                            );
                        }}
                    />
                </ArrayField>
            </Datagrid>
        </List>
    );
};

export default InterestCategoryList;
