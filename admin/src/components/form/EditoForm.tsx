import { Box, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Form, Loading, TabbedForm, useGetIdentity, useTranslate } from 'react-admin';
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

    const [mandatoryLanguages, setMandatoryLanguages] = useState<string[]>([]);

    const [image, setImage] = useState<File | undefined>(undefined);
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

        setIsDisabled(!mandatoryLanguageIsCompleted || !mandatoryTranslationsAreCompleted);
    }, [translations, content, mandatoryLanguages]);

    const handleOnSubmit = () => {
        const payload: EditoFormPayload = {
            id: record.id,
            content,
            languageCode: record.languageCode,
            image,
            translations,
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
                                        <RichTextInput
                                            defaultValue={translation.content}
                                            onChange={(e: any) => {
                                                const newTranslations = [...translations];
                                                const newTranslation = {
                                                    languageCode: translation.languageCode,
                                                    content: e,
                                                };
                                                newTranslations[index] = newTranslation;

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
