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
    List,
    Datagrid,
    useTranslate,
    TextField,
    FunctionField,
    useGetIdentity,
    Loading,
    SelectInput,
    TextInput,
    DateField,
    usePermissions,
} from 'react-admin';
import ColoredChips, { ChipsColors } from '../../components/ColoredChips';
import useGetUniversitiesLanguages from '../../components/form/useGetUniversitiesLanguages';
import PageTitle from '../../components/PageTitle';
import { Role } from '../../entities/Administrator';
import { News, NewsStatus, NewsTranslation } from '../../entities/News';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const StatusChips = ({ status }: { status: string }) => {
    const translate = useTranslate();

    let color: ChipsColors = 'default';
    switch (status) {
        case NewsStatus.DRAFT:
            color = 'default';
            break;
        case NewsStatus.READY:
            color = 'success';
            break;
    }

    return <ColoredChips color={color} label={translate(`news.status.${status}`)} />;
};

const NewsList = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { universitiesLanguages, universitiesData } = useGetUniversitiesLanguages();

    const filters = [
        <TextInput key="titleFilter" label={translate('news.list.filters.title')} source="title" alwaysOn />,
        <SelectInput
            key="defaultLanguageFilter"
            choices={universitiesLanguages.map((language) => ({
                id: language.code,
                name: codeLanguageToFlag(language.code),
            }))}
            label={translate('news.list.filters.language')}
            source="languageCode"
            alwaysOn
        />,
        <SelectInput
            key="statusFilter"
            choices={Object.values(NewsStatus).map((status) => ({
                id: status,
                name: translate(`news.status.${status}`),
            }))}
            label={translate('news.list.filters.status')}
            source="status"
            alwaysOn
        />,
    ];

    if (identity?.isCentralUniversity && universitiesData && permissions.checkRole(Role.SUPER_ADMIN)) {
        filters.unshift(
            <SelectInput
                key="groupFilter"
                choices={universitiesData}
                label={translate('news.list.filters.university')}
                source="universityId"
                alwaysOn
            />
        );
    }

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <List
                exporter={false}
                filter={
                    !identity?.isCentralUniversity || !permissions.checkRole(Role.SUPER_ADMIN)
                        ? { universityId: identity?.universityId }
                        : undefined
                }
                filters={filters}
            >
                <Datagrid rowClick="edit">
                    <TextField label="news.list.title" source="title" />
                    {identity?.isCentralUniversity && (
                        <TextField label="news.list.university" source="university.name" />
                    )}
                    <FunctionField
                        label="news.list.defaultLanguage"
                        render={(record: News) => codeLanguageToFlag(record.languageCode)}
                    />
                    <FunctionField
                        label="news.list.translations"
                        render={(record: News) =>
                            record.translations
                                ?.map((translation: NewsTranslation) => codeLanguageToFlag(translation.languageCode))
                                .join(', ')
                        }
                    />
                    <DateField label="news.list.startPublicationDate" source="startPublicationDate" />
                    <DateField label="news.list.endPublicationDate" source="endPublicationDate" />
                    <FunctionField
                        label="news.list.status"
                        render={(record: any) => <StatusChips status={record.status} />}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default NewsList;
