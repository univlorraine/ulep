import { Select, MenuItem } from '@mui/material';
import React from 'react';
import { useTranslate, FunctionField, Datagrid, List, TextField, useUpdate, useNotify, useRefresh } from 'react-admin';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Language from '../../entities/Language';

const LanguageList = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const onUpdateLanguage = async (
        code: string,
        mainUniversityStatus: LanguageStatus,
        secondaryUniversityActive: boolean,
        isDiscovery: boolean
    ) => {
        const payload = {
            code,
            mainUniversityStatus,
            secondaryUniversityActive,
            isDiscovery,
        };
        await update(
            'languages',
            { data: payload },
            {
                onSettled: (_, error: unknown) => {
                    if (!error) {
                        notify('languages.status.success');
                    } else {
                        notify('languages.status.error');
                    }

                    return refresh();
                },
            }
        );
    };

    return (
        <>
            <ConfigPagesHeader />
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translate('languages.code')} source="code" />
                    <FunctionField
                        label={translate('languages.name')}
                        render={(record: Language) => translate(`languages_code.${record.code}`)}
                        sortable={false}
                        source="code"
                    />
                    <FunctionField
                        label={translate('languages.status.title')}
                        render={(record: Language) => (
                            <Select
                                onChange={(value) =>
                                    onUpdateLanguage(
                                        record.code,
                                        value.target.value as LanguageStatus,
                                        record.secondaryUniversityActive,
                                        record.isDiscovery
                                    )
                                }
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                value={record.mainUniversityStatus}
                            >
                                <MenuItem value="PRIMARY">{translate('languages.status.primary')}</MenuItem>
                                <MenuItem value="SECONDARY">{translate('languages.status.secondary')}</MenuItem>
                                <MenuItem value="UNACTIVE">{translate('languages.status.unactive')}</MenuItem>
                            </Select>
                        )}
                        sortBy="mainUniversityStatus"
                    />
                    <FunctionField
                        label={translate('languages.secondary_status.title')}
                        render={(record: Language) => (
                            <Select
                                onChange={(value) =>
                                    onUpdateLanguage(
                                        record.code,
                                        record.mainUniversityStatus,
                                        value.target.value === 'ACTIVE',
                                        record.isDiscovery
                                    )
                                }
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                value={record.secondaryUniversityActive ? 'ACTIVE' : 'UNACTIVE'}
                            >
                                <MenuItem value="ACTIVE">{translate('languages.secondary_status.active')}</MenuItem>
                                <MenuItem value="UNACTIVE">{translate('languages.secondary_status.unactive')}</MenuItem>
                            </Select>
                        )}
                        sortBy="secondaryUniversityActive"
                    />
                    <FunctionField
                        label={translate('languages.isDiscovery.title')}
                        render={(record: Language) => (
                            <Select
                                onChange={(value) =>
                                    onUpdateLanguage(
                                        record.code,
                                        record.mainUniversityStatus,
                                        record.secondaryUniversityActive,
                                        value.target.value === 'true'
                                    )
                                }
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                value={record.isDiscovery ? 'true' : 'false'}
                            >
                                <MenuItem value="false">{translate('languages.isDiscovery.no')}</MenuItem>
                                <MenuItem value="true">{translate('languages.isDiscovery.yes')}</MenuItem>
                            </Select>
                        )}
                        sortBy="isDiscovery"
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default LanguageList;
