import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslate, FunctionField, ArrayField, List, Datagrid, CreateButton, TopToolbar } from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import ColoredChips from '../../components/ColoredChips';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import InterestCategory from '../../entities/InterestCategory';

const InterestCategoryAction = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

const InterestCategoryList = () => {
    const translation = useTranslate();
    const navigate = useNavigate();

    return (
        <>
            <ConfigPagesHeader />
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
                                    color: '#212121',
                                    cursor: 'pointer',
                                }}
                                to={`/interests/categories/${record.id}/show`}
                            >
                                {record.name}
                            </Typography>
                        )}
                    />
                    <ArrayField
                        label={translation('interest_categories.interests')}
                        sortable={false}
                        source="interests"
                    >
                        <FunctionField
                            render={(record: InterestCategory) => (
                                <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                    {record.interests.map((interest: any) => (
                                        <Link key={interest.id} to={`/interests/${interest.id}/show`}>
                                            <ColoredChips color="secondary" label={interest.name} />
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() =>
                                            navigate('/interests/create', { state: { category: record.id } })
                                        }
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                        }}
                                        type="button"
                                    >
                                        <ColoredChips color="default" label="+" />
                                    </button>
                                </Box>
                            )}
                        />
                    </ArrayField>
                </Datagrid>
            </List>
        </>
    );
};

export default InterestCategoryList;
