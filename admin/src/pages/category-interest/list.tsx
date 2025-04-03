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
