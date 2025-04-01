/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import Box from '@mui/material/Box';
import { BulkDeleteButton, Datagrid, DateField, FunctionField, List, TextField, useTranslate } from 'react-admin';
import ColoredChips from '../../components/ColoredChips';
import ReferenceUploadField from '../../components/field/ReferenceUploadImageField';
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
