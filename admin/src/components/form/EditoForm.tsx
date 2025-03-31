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

import { Box, Input, OutlinedInput, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Form, Loading, TabbedForm, useGetIdentity, useNotify, useTranslate } from 'react-admin';
import { Edito, EditoFormPayload, EditoMandatoryTranslation, EditoTranslation } from '../../entities/Edito';
import customDataProvider from '../../providers/customDataProvider';
import ImageUploader from '../ImageUploader';

interface EditoFormProps {
    handleSubmit: (payload: EditoFormPayload) => void;
    record: Edito;
}

const EditoForm: React.FC<EditoFormProps> = ({ handleSubmit, record }) => {
    const dataProvider = customDataProvider;
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const notify = useNotify();
    const [mandatoryLanguages, setMandatoryLanguages] = useState<string[]>([]);

    const [image, setImage] = useState<File | undefined>(undefined);
    const [video, setVideo] = useState<string>(record.video ?? '');
    const [content, setContent] = useState<string>(record.content ?? '');
    const [translations, setTranslations] = useState<EditoTranslation[]>(record.translations ?? []);

    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    useEffect(() => {
        const getMandatoryLanguages = async () => {
            const instance: any = await dataProvider.getOne('instance', { id: 'config' });
            if (instance) {
                const mandatoryTranslationsConfig = instance.data.editoMandatoryTranslations;

                if (mandatoryTranslationsConfig.length === 0) {
                    return;
                }

                const languagesMapping: { [key: string]: string } = {
                    [EditoMandatoryTranslation.CentralUniversityLanguage]: record.languageCode,
                    [EditoMandatoryTranslation.English]: 'en',
                };
                const partnerUniversityLanguage = record.translations.find(
                    (translation) => translation.languageCode !== 'en'
                )?.languageCode;
                if (partnerUniversityLanguage) {
                    languagesMapping[EditoMandatoryTranslation.PartnerUniversityLanguage] = partnerUniversityLanguage;
                }

                const mandatoryLanguagesBuild: string[] = [];
                mandatoryTranslationsConfig.forEach((key: string) => {
                    if (languagesMapping[key]) {
                        const language = languagesMapping[key];
                        mandatoryLanguagesBuild.push(language);
                    }
                });

                setMandatoryLanguages(mandatoryLanguagesBuild);
            }
        };
        getMandatoryLanguages();
    }, []);

    const isValidUrl = (url: string): boolean => {
        const urlRegex = /^$|^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

        return urlRegex.test(url);
    };

    useEffect(() => {
        let mandatoryLanguageIsCompleted = true;
        if (mandatoryLanguages.includes(record.languageCode) && content.length < 50) {
            mandatoryLanguageIsCompleted = false;
        }

        let mandatoryTranslationsAreCompleted = true;
        mandatoryLanguages.forEach((language) => {
            const currentTranslation = translations.find((translation) => translation.languageCode === language);
            if (currentTranslation && currentTranslation.content.length < 50) {
                mandatoryTranslationsAreCompleted = false;
            }
        });

        let videoIsInvalid = false;
        translations.forEach((translation) => {
            if (!isValidUrl(translation.video)) {
                videoIsInvalid = true;
            }
        });
        if (!isValidUrl(video)) {
            videoIsInvalid = true;
        }

        if (videoIsInvalid) {
            notify(translate('editos.form.invalidVideoUrl'));
        }

        setIsDisabled(!mandatoryLanguageIsCompleted || !mandatoryTranslationsAreCompleted || videoIsInvalid);
    }, [translations, content, mandatoryLanguages]);

    const handleOnSubmit = () => {
        const payload: EditoFormPayload = {
            id: record.id,
            content,
            languageCode: record.languageCode,
            image,
            translations,
            video,
        };

        handleSubmit(payload);
    };

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Form>
            {record && (
                <Box sx={{ '& .MuiDivider-root': { display: 'none' }, '& .MuiToolbar-root': { display: 'none' } }}>
                    <Typography variant="h3">{record.university.name}</Typography>
                    <Box sx={{ marginTop: '30px' }}>
                        <Box>
                            <Typography variant="subtitle1">{translate('events.form.illustration')}</Typography>
                            <ImageUploader onImageSelect={setImage} />
                        </Box>

                        <Typography sx={{ marginTop: '30px', fontStyle: 'italic', fontSize: '0.8rem' }}>
                            {translate('editos.form.mandatoryLanguages')}
                        </Typography>

                        <TabbedForm>
                            <TabbedForm.Tab
                                label={`${record.languageCode} ${mandatoryLanguages.includes(record.languageCode) ? ' *' : ''}`}
                                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                            >
                                <Box sx={{ width: '100%', '& .RaLabeled-label': { display: 'none' } }}>
                                    <Typography variant="subtitle1">{translate('editos.form.video')}</Typography>
                                    <OutlinedInput
                                        defaultValue={video}
                                        onChange={(e: any) => {
                                            setVideo(e.target.value);
                                        }}
                                        fullWidth
                                    />
                                    <RichTextInput
                                        defaultValue={content}
                                        onChange={(value) => setContent(value)}
                                        source=""
                                        fullWidth
                                    />
                                </Box>
                            </TabbedForm.Tab>

                            {record.translations?.map((translation, index) => (
                                <TabbedForm.Tab
                                    key={translation.languageCode}
                                    label={`${translation.languageCode} ${mandatoryLanguages.includes(translation.languageCode) ? ' *' : ''}`}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                                >
                                    <Box sx={{ width: '100%', '& .RaLabeled-label': { display: 'none' } }}>
                                        <Input
                                            defaultValue={translation.video}
                                            onChange={(e: any) => {
                                                const newTranslations = [...translations];
                                                newTranslations[index].video = e.target.value;
                                                setTranslations(newTranslations);
                                            }}
                                            fullWidth
                                        />
                                        <RichTextInput
                                            defaultValue={translation.content}
                                            onChange={(e: any) => {
                                                const newTranslations = [...translations];
                                                newTranslations[index].content = e;
                                                setTranslations(newTranslations);
                                            }}
                                            source=""
                                            fullWidth
                                        />
                                    </Box>
                                </TabbedForm.Tab>
                            ))}
                        </TabbedForm>
                    </Box>
                </Box>
            )}

            <Button
                color="primary"
                disabled={isDisabled}
                onClick={handleOnSubmit}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('editos.form.update')}</span>
            </Button>
        </Form>
    );
};

export default EditoForm;
