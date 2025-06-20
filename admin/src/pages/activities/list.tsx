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

import React from 'react';
import {
    useTranslate,
    List,
    Datagrid,
    TextField,
    FunctionField,
    TextInput,
    AutocompleteInput,
    useGetList,
    SelectInput,
    useGetIdentity,
    Loading,
    Filter,
    useRefresh,
} from 'react-admin';
import ActivityStatusChips from '../../components/ActivityStatusChipsProps';
import PageTitle from '../../components/PageTitle';
import { Activity, ActivityStatus } from '../../entities/Activity';
import { ActivityThemeCategory } from '../../entities/ActivityThemeCategory';
import ProficiencyLevel from '../../entities/Proficiency';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';
import useGetSortedLanguagesWithLabel from '../../utils/useGetSortedLanguagesWithLabel';

const Filters = (props: any) => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: universities } = useGetList('universities');
    const { data: languages } = useGetList('languages', {
        pagination: {
            page: 1,
            perPage: 9999,
        },
    });
    const { data: categories } = useGetList('activities/categories');

    const sortedLanguages = useGetSortedLanguagesWithLabel(languages);

    if (isLoadingIdentity || !identity || !categories || !universities || !languages) {
        return <Loading />;
    }

    return (
        <Filter {...props}>
            {identity?.isCentralUniversity && universities && (
                <SelectInput
                    key="university"
                    choices={universities}
                    label={translate('activities.list.university')}
                    source="university"
                    alwaysOn
                />
            )}
            <TextInput key="title" label={translate('activities.list.title')} source="title" alwaysOn />
            {sortedLanguages && (
                <AutocompleteInput
                    key="languageCode"
                    choices={sortedLanguages}
                    label={translate('activities.list.language')}
                    optionText={(option) => option.label}
                    optionValue="code"
                    source="languageCode"
                    alwaysOn
                />
            )}
            <SelectInput
                key="languageLevel"
                choices={Object.values(ProficiencyLevel).map((level) => ({
                    id: level,
                    name: level,
                }))}
                label={translate('activities.list.level')}
                source="languageLevel"
                alwaysOn
            />
            <SelectInput
                key="category"
                choices={categories?.map((category: ActivityThemeCategory) => ({
                    id: category.id,
                    name: category.content,
                }))}
                label={translate('activities.list.category')}
                source="category"
                alwaysOn
            />
            <SelectInput
                key="status"
                choices={Object.values(ActivityStatus).map((status) => ({
                    id: status,
                    name: translate(`activities.status.${status.toLowerCase()}`),
                }))}
                label={translate('activities.list.status')}
                source="status"
                alwaysOn
            />
        </Filter>
    );
};

const ActivityList = () => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <List
                exporter={false}
                filter={!identity?.isCentralUniversity ? { university: identity.universityId } : undefined}
                filters={<Filters useRefresh={refresh} />}
            >
                <Datagrid rowClick="show">
                    <FunctionField
                        label={translate('activities.list.language')}
                        render={(record: any) => <span>{codeLanguageToFlag(record.language.code)}</span>}
                        sortable={false}
                        source="language"
                    />
                    <TextField label={translate('activities.list.level')} sortable={false} source="languageLevel" />
                    <TextField
                        label={translate('activities.list.category')}
                        sortable={false}
                        source="theme.category.content"
                    />
                    <TextField label={translate('activities.list.theme')} sortable={false} source="theme.content" />
                    {identity?.isCentralUniversity && (
                        <TextField
                            label={translate('activities.list.university')}
                            sortable={false}
                            source="university.name"
                        />
                    )}
                    <FunctionField
                        label={translate('activities.list.creator')}
                        render={(record: Activity) => {
                            if (!record.creator) {
                                return translate('activities.list.admin');
                            }

                            return `${record.creator.user.firstname} ${record.creator.user.lastname}`;
                        }}
                        sortable={false}
                    />
                    <TextField label={translate('activities.list.title')} sortable={false} source="title" />
                    <FunctionField
                        label={translate('activities.list.status')}
                        render={(record: any) => <ActivityStatusChips status={record.status} />}
                        sortable={false}
                        source="language"
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default ActivityList;
