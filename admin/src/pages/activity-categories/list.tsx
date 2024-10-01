import { Box, Typography } from '@mui/material';
import React from 'react';
import { List, Datagrid, CreateButton, TopToolbar, FunctionField, useTranslate, ArrayField } from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import ColoredChips from '../../components/ColoredChips';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import { ActivityThemeCategory } from '../../entities/ActivityThemeCategory';

const ActivityCategoriesAction = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

const ActivityCategoriesList = () => {
    const translation = useTranslate();
    const navigate = useNavigate();

    return (
        <>
            <ConfigPagesHeader />
            <List actions={<ActivityCategoriesAction />} exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <FunctionField
                        label={translation('activities_categories.name')}
                        render={(record: ActivityThemeCategory) => (
                            <Typography
                                component={Link}
                                style={{
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    color: '#212121',
                                    cursor: 'pointer',
                                }}
                                to={`/activities/categories/${record.id}/show`}
                            >
                                {record.content}
                            </Typography>
                        )}
                    />
                    <ArrayField label={translation('activities_categories.themes')} sortable={false}>
                        <FunctionField
                            render={(record: ActivityThemeCategory) => (
                                <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px' }}>
                                    {record.themes.map((theme: any) => (
                                        <Link key={theme.id} to={`/activities/themes/${theme.id}/show`}>
                                            <ColoredChips color="secondary" label={theme.content} />
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() =>
                                            navigate('/activities/themes/create', {
                                                state: { categoryId: record.id },
                                            })
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

export default ActivityCategoriesList;
