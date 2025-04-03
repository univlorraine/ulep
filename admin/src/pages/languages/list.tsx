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

import { Select, MenuItem } from '@mui/material';
import React from 'react';
import {
    useTranslate,
    FunctionField,
    Datagrid,
    List,
    TextField,
    useUpdate,
    useNotify,
    useRefresh,
    TextInput,
} from 'react-admin';
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

    const filters = [
        <TextInput key="languageCode" label={translate('languages.filters.language_code')} source="code" alwaysOn />,
        <TextInput key="languageName" label={translate('languages.filters.language_name')} source="name" alwaysOn />,
    ];

    return (
        <>
            <ConfigPagesHeader />
            <List exporter={false} filters={filters}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label={translate('languages.code')} source="code" />
                    <FunctionField
                        label={translate('languages.name')}
                        render={(record: Language) => translate(`languages_code.${record.code}`)}
                        sortable={false}
                    />
                    <TextField label={translate('languages.original_name')} sortable={false} source="name" />
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
