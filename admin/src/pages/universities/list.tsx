import Box from '@mui/material/Box';
import React from 'react';
import { FunctionField, useTranslate, List, Datagrid, TextField, BulkDeleteButton, DateField } from 'react-admin';
import ColoredChips from '../../components/ColoredChips';
import ReferenceUploadField from '../../components/field/ReferenceUploadField';
import UniversitiesPagesHeader from '../../components/tabs/UniversitiesPagesHeader';
import University, { Status } from '../../entities/University';
import i18nProvider from '../../providers/i18nProvider';

type UniversityNameProps = {
    name: string;
    isMainUniversity?: boolean;
};

type UniversityStatusProps = {
    record: University;
};

const UniversityName = ({ name, isMainUniversity = false }: UniversityNameProps) => {
    const translate = useTranslate();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '13px',
                '& img.RaImageField-image': { width: '40px', height: '40px' },
            }}
        >
            <ReferenceUploadField source="logo.id" />
            <Box>
                <Box>{name}</Box>
                {isMainUniversity ? <Box sx={{ color: '#767676' }}>{translate('universities.parent')}</Box> : null}
            </Box>
        </Box>
    );
};

const UniversityStatus = ({ record }: UniversityStatusProps) => {
    const translate = useTranslate();
    const currentDate = new Date(Date.now());
    const currentDateTime = currentDate.getTime();
    const twoWeeksLaterDateTime = currentDate.setDate(currentDate.getDate() + 2 * 7);
    const admissionStartTime = new Date(record.admissionStart).getTime();
    const admissionEndTime = new Date(record.admissionEnd).getTime();

    if (currentDateTime >= admissionStartTime && currentDateTime <= admissionEndTime) {
        return <ColoredChips color="success" label={translate(`universities.status.${Status.OPEN.toLowerCase()}`)} />;
    }

    if (currentDateTime < admissionStartTime && twoWeeksLaterDateTime >= admissionStartTime) {
        return <ColoredChips color="secondary" label={translate(`universities.status.${Status.SOON.toLowerCase()}`)} />;
    }

    return <ColoredChips color="default" label={translate(`universities.status.${Status.CLOSED.toLowerCase()}`)} />;
};

const UniversityBulkActionsToolbar = () => <BulkDeleteButton mutationMode="pessimistic" />;

const UniversityList = (props: any) => {
    const translate = useTranslate();
    const locale = i18nProvider.getLocale();

    return (
        <>
            <UniversitiesPagesHeader />
            <List exporter={false} {...props} sort={{ field: 'name', order: 'ASC' }} pagination>
                <Datagrid
                    bulkActionButtons={<UniversityBulkActionsToolbar />}
                    isRowSelectable={(record: University) => !!record.parent}
                    rowClick="show"
                >
                    <FunctionField
                        label={translate('universities.name')}
                        render={(record: University) => (
                            <UniversityName isMainUniversity={!record.parent} name={record.name} />
                        )}
                        source="name"
                        sortable
                    />
                    <TextField label={translate('universities.country')} sortable={false} source="country.name" />
                    <FunctionField
                        label={translate('universities.language')}
                        render={(record: University) => translate(`languages_code.${record.nativeLanguage.code}`)}
                    />
                    <FunctionField
                        label={translate('universities.pairing_mode.label')}
                        render={(record: University) =>
                            translate(`universities.pairing_mode.${record.pairingMode.toLowerCase()}`)
                        }
                    />
                    <FunctionField
                        label={translate('universities.status.label')}
                        render={(record: University) => <UniversityStatus record={record} />}
                    />
                    <DateField
                        label={translate('universities.admission_start')}
                        locales={locale}
                        sortable={false}
                        source="admissionStart"
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default UniversityList;
