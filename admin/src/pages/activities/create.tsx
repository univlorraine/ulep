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

import { Create, useCreate, useNotify, useRedirect, useTranslate } from 'react-admin';
import ActivityForm from '../../components/form/ActivityForm';
import PageTitle from '../../components/PageTitle';
import { ActivityExercise, ActivityVocabulary } from '../../entities/Activity';

const CreateActivity = () => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [create] = useCreate();

    type handleCreateSubmitPayload = {
        title: string;
        description: string;
        image: File | string;
        creditImage?: string;
        language: string;
        languageLevel: string;
        themeId: string;
        ressourceUrl?: string;
        resourceFile?: File | string;
        universityId: string;
        exercises: ActivityExercise[];
        vocabularies: ActivityVocabulary[];
    };

    const handleSubmit = async (payload: handleCreateSubmitPayload) => {
        const vocabulariesFiles: File[] = [];
        payload.vocabularies?.forEach((vocabulary: ActivityVocabulary) => {
            if (vocabulary.file) {
                const newFile = new File([vocabulary.file], `${vocabulary.content}.wav`, {
                    type: vocabulary.file.type,
                });
                vocabulariesFiles.push(newFile);
            }
        });

        const formData = new FormData();

        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('languageLevel', payload.languageLevel);
        formData.append('languageCode', payload.language);
        formData.append('themeId', payload.themeId);
        formData.append('universityId', payload.universityId);
        formData.append('image', payload.image);
        payload.exercises.forEach((exercise: any, index: number) => {
            formData.append(`exercises[${index}][content]`, exercise.content);
            formData.append(`exercises[${index}][order]`, exercise.order);
        });
        payload.vocabularies?.forEach((vocabulary: any, index: number) => {
            formData.append(`vocabularies[${index}]`, vocabulary.content);
        });
        vocabulariesFiles?.forEach((vocabularyFile: File, index: number) => {
            formData.append(`vocabulariesFiles[${index}]`, vocabularyFile);
        });
        if (payload.creditImage) formData.append('creditImage', payload.creditImage);
        if (payload.ressourceUrl) formData.append('ressourceUrl', payload.ressourceUrl);
        if (payload.resourceFile) formData.append('ressource', payload.resourceFile);

        await create(
            'activities',
            { data: formData },
            {
                onSuccess: () => redirect('/activities'),
                onError: (error) => {
                    console.error(error);
                    notify('activities.create.error', {
                        type: 'error',
                    });
                },
            }
        );
    };

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <Create title={translate('activities.create.title')}>
                <ActivityForm handleSubmit={handleSubmit} />
            </Create>
        </>
    );
};

export default CreateActivity;
