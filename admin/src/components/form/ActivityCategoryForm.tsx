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

import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import TranslationForm from './TranslationForm';

interface ActivityCategoryFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[]) => void;
    name?: string;
    translations?: IndexedTranslation[];
}

const ActivityCategoryForm: React.FC<ActivityCategoryFormProps> = ({ handleSubmit, name, translations }) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(name || '');
    const [newTranslations, setNewTranslations] = useState<IndexedTranslation[]>(translations || []);

    useEffect(() => {
        setNewName(name || '');
        setNewTranslations(translations || []);
    }, [name, translations]);

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`activities_categories.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Language"
                    sx={{ mx: 4, my: 2, width: '80px' }}
                    value={window.REACT_APP_DEFAULT_TRANSLATION_LANGUAGE}
                    disableUnderline
                />
                <Input
                    name="Content"
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={translate('global.content')}
                    value={newName}
                    disableUnderline
                    required
                />
            </Box>

            <TranslationForm setTranslations={setNewTranslations} translations={newTranslations} />
            <Button
                color="primary"
                onClick={() => handleSubmit(newName, newTranslations)}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ActivityCategoryForm;
