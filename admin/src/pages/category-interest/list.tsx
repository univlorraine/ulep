import { Chip } from '@material-ui/core';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
    useTranslate,
    FunctionField,
    ArrayField,
    List,
    Datagrid,
    CreateButton,
    TopToolbar,
    useRefresh,
} from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import InterestCategory from '../../entities/InterestCategory';

const InterestCategoryAction = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

const InterestCategoryList = () => {
    const translation = useTranslate();
    const refresh = useRefresh();
    const navigate = useNavigate();

    useEffect(() => {
        refresh();
    }, []);

    return (
        <List actions={<InterestCategoryAction />} exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <FunctionField
                    label={translation('interest_categories.name')}
                    render={(record: { id: string; name: string }) => (
                        <Typography
                            component={Link}
                            style={{
                                fontSize: '0.875rem',
                                textDecoration: 'none',
                                color: 'rgba(0, 0, 0, 0.87)',
                                cursor: 'pointer',
                            }}
                            to={`/interests/categories/${record.id}/show`}
                        >
                            {record.name}
                        </Typography>
                    )}
                />
                <ArrayField label={translation('interest_categories.interests')} sortable={false} source="interests">
                    <FunctionField
                        render={(record: InterestCategory) => (
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
                                <button
                                    onClick={() => navigate('/interests/create', { state: { category: record.id } })}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                    }}
                                    type="button"
                                >
                                    <Chip
                                        color="default"
                                        label="+"
                                        style={{ margin: '0 5px 5px 0', cursor: 'pointer' }}
                                    />
                                </button>
                            </div>
                        )}
                    />
                </ArrayField>
            </Datagrid>
        </List>
    );
};

export default InterestCategoryList;
