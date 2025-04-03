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

import { Box, Typography, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import ImageUploader from '../ImageUploader';
import TranslationForm from './TranslationForm';

interface ObjectiveFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[], file?: File) => Promise<void>;
    name?: string;
    tranlsations?: IndexedTranslation[];
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ handleSubmit, name, tranlsations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name || '');
    const [file, setFile] = useState<File>();
    const [currentTranslations, setCurrentTranslations] = useState<IndexedTranslation[]>(tranlsations ?? []);

    const sumbit = async () => {
        if (!currentName) {
            return;
        }

        await handleSubmit(currentName, currentTranslations, file);
    };

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate('objectives.create.name')}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row" gap="10px">
                <OutlinedInput name="Language" sx={{ width: '80px' }} value="FR" />
                <OutlinedInput
                    name="Content"
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder={translate('global.content')}
                    value={currentName}
                    required
                />
            </Box>
            <Typography sx={{ mt: 4 }} variant="subtitle1">
                {translate('objectives.create.image')}
            </Typography>
            <ImageUploader onImageSelect={setFile} source="image.id" />
            <Box sx={{ mt: 4 }}>
                <TranslationForm setTranslations={setCurrentTranslations} translations={currentTranslations} />
            </Box>
            <Button
                color="primary"
                disabled={!currentName}
                onClick={sumbit}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ObjectiveForm;
