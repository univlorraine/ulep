import { Chip } from '@material-ui/core';
import React from 'react';
import { useTranslate } from 'react-admin';
import { FunctionField, ArrayField, List, Datagrid, TextField } from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import InterestCategory from '../../entities/InterestCategory';
import { CreateButton } from 'react-admin';
import { TopToolbar } from 'react-admin';
import { Typography } from '@mui/material';

const InterestCategoryAction = () => {
    return (
        <TopToolbar>
            <CreateButton />
        </TopToolbar>
    );
};

const InterestCategoryList = () => {
    const translation = useTranslate();
    const navigate = useNavigate();

    return (
        <List actions={<InterestCategoryAction />} exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <FunctionField
                    label={translation('interest_categories.name')}
                    render={(record: { id: string; name: string }) => {
                        return (
                            <Typography
                                component={Link}
                                to={`/interests/categories/${record.id}/show`}
                                style={{
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    cursor: 'pointer',
                                }}
                            >
                                {record.name}
                            </Typography>
                        );
                    }}
                />
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
                                                style={{ margin: '0 5px 5px 0', cursor: 'pointer' }}
                                            />
                                        </Link>
                                    ))}
                                    <span
                                        onClick={() =>
                                            navigate('/interests/create', { state: { category: record.id } })
                                        }
                                    >
                                        <Chip
                                            color="default"
                                            label="+"
                                            style={{ margin: '0 5px 5px 0', cursor: 'pointer' }}
                                        />
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
