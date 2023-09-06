import { Select, MenuItem } from '@mui/material';
import React from 'react';
import { useTranslate, FunctionField, Datagrid, List, TextField, useUpdate, useNotify, useRefresh } from 'react-admin';
import Language from '../../entities/Language';

const LanguageList = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const onUpdateLanguageStatus = async (
        code: string,
        mainUniversityStatus: LanguageStatus,
        secondaryUniversityActive: boolean
    ) => {
        const payload = {
            code,
            mainUniversityStatus,
            secondaryUniversityActive,
        };
        await update(
            'languages',
            { data: payload },
            {
                onSettled: (data: any, error: Error) => {
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
        <List exporter={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField label={translate('languages.code')} source="code" />
                <TextField label={translate('languages.name')} source="name" />
                <FunctionField
                    label={translate('languages.status.title')}
                    render={(record: Language) => (
                        <Select
                            onChange={(value) =>
                                onUpdateLanguageStatus(
                                    record.code,
                                    value.target.value as LanguageStatus,
                                    record.secondaryUniversityActive
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
                                onUpdateLanguageStatus(
                                    record.code,
                                    record.mainUniversityStatus,
                                    value.target.value === 'ACTIVE'
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
                    sortBy="secondaryUniversityStatus"
                />
            </Datagrid>
        </List>
    );
};

export default LanguageList;
