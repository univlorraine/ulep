import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Button, Loading, TabbedForm, useGetIdentity, useGetList, useTranslate } from 'react-admin';
import { ActivityExercise, ActivityVocabulary } from '../../entities/Activity';
import { ActivityTheme } from '../../entities/ActivityTheme';
import ProficiencyLevel from '../../entities/Proficiency';
import AudioLine from '../chat/AudioLine';
import RecordingButton from '../chat/RecordingButton';
import useAudioRecorder from '../chat/useAudioRecorder';
import FileUploader from '../FileUploader';
import ImageUploader from '../ImageUploader';
import useGetUniversitiesLanguages from './useGetUniversitiesLanguages';

interface ActivityFormProps {
    id?: string;
    title?: string;
    description?: string;
    image?: File;
    imageCredit?: string;
    language?: string;
    level?: string;
    theme?: string;
    resourceURL?: string;
    resourceFile?: File;
    handleSubmit: (payload: any) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
    id,
    title,
    description,
    image,
    imageCredit,
    language,
    level,
    theme,
    resourceURL,
    resourceFile,
    handleSubmit,
}) => {
    const DEFAULT_EXCERCISES = [
        {
            content: '',
            order: 0,
        },
        {
            content: '',
            order: 1,
        },
        {
            content: '',
            order: 2,
        },
    ];

    const { hasPermission, isRecording, startRecording, stopRecording } = useAudioRecorder();

    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const [newTitle, setNewTitle] = useState<string>(title || '');
    const [newDescription, setNewDescription] = useState<string>(description || '');
    const [newImage, setNewImage] = useState<File>();
    const [newImageCredit, setNewImageCredit] = useState<string>(imageCredit || '');
    const [newLanguage, setNewLanguage] = useState<string>(language || '');
    const [newLevel, setNewLevel] = useState<string>(level || '');
    const [newThemeCategory, setNewThemeCategory] = useState<string>(theme || '');
    const [newTheme, setNewTheme] = useState<string>('');
    const [ressourceChoice, setRessourceChoice] = useState<'url' | 'file' | null>(null);
    const [newResourceURL, setNewResourceURL] = useState<string>(resourceURL || '');
    const [newResourceFile, setNewResourceFile] = useState<File>();
    const [newExercises, setNewExercises] = useState<ActivityExercise[]>(DEFAULT_EXCERCISES);
    const [newVocabulary, setNewVocabulary] = useState<ActivityVocabulary[]>([]);
    const universitiesLanguages = useGetUniversitiesLanguages();
    const proficiencyLevels = Object.values(ProficiencyLevel);
    const activityThemesCategories = useGetList('activities/categories');
    // const activityThemes = activityThemesCategories.data?.map((category) => category.themes).flat();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    console.log({ image });
    console.log({ resourceFile });

    const onDeleteExcercisePressed = (order: number) => {
        const excercises = [...newExercises];
        excercises.splice(order, 1);
        const exercicesUpdated = excercises
            .sort((a, b) => a.order - b.order)
            .map((exc, index) => ({ ...exc, order: index }));
        setNewExercises(exercicesUpdated);
    };

    const onAddExcercisePressed = () => {
        if (newExercises.length >= 6) {
            return;
        }
        setNewExercises([...newExercises, { content: '', order: newExercises.length }]);
    };

    const onUpExcercisePressed = (order: number) => {
        if (order === 0) return;
        const exercises = [...newExercises];
        [exercises[order - 1], exercises[order]] = [exercises[order], exercises[order - 1]];
        setNewExercises(exercises.map((exc, index) => ({ ...exc, order: index })));
    };

    const onDownExcercisePressed = (order: number) => {
        if (order === newExercises.length - 1) return;
        const exercises = [...newExercises];
        [exercises[order + 1], exercises[order]] = [exercises[order], exercises[order + 1]];
        setNewExercises(exercises.map((exc, index) => ({ ...exc, order: index })));
    };

    const onContentExcerciseChange = (content: string, order: number) => {
        const exercises = [...newExercises];
        exercises[order].content = content;
        setNewExercises(exercises);
    };

    const onAddVocabularyPressed = () => {
        setNewVocabulary([...newVocabulary, { content: '', file: undefined }]);
    };

    const onUpdateContentVocabulary = (content: string, index: number) => {
        const vocabularies = [...newVocabulary];
        vocabularies[index].content = content;
        setNewVocabulary(vocabularies);
    };

    const onDeletePronunciation = (index: number) => {
        const vocabularies = [...newVocabulary];
        vocabularies[index].file = undefined;
        setNewVocabulary(vocabularies);
    };

    const handleDeleteVocabulary = (index: number) => {
        const vocabularies = newVocabulary.filter((_, i) => i !== index);
        setNewVocabulary(vocabularies);
    };

    const handleStartRecord = () => {
        if (isRecording) {
            return;
        }
        startRecording();
    };

    const handleStopRecord = async (index: number) => {
        const vocabularies = [...newVocabulary];
        vocabularies[index].file = await stopRecording();
        setNewVocabulary(vocabularies);
    };

    const onCreatePressed = () =>
        /*         if (!) {
            return notify(translate('admin_groups_picker.mandatory'));
        } */

        handleSubmit({
            id,
            title: newTitle,
            description: newDescription,
            image: newImage,
            creditImage: newImageCredit,
            languageCode: newLanguage,
            languageLevel: newLevel,
            themeId: newTheme,
            ressourceUrl: newResourceURL,
            resourceFile: newResourceFile,
            universityId: identity.universityId,
            exercises: newExercises,
            vocabularies: newVocabulary,
        });

    console.log({ activityThemesCategories });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiToolbar-root': { display: 'none' },
                '& .MuiDivider-root': { display: 'none' },
            }}
        >
            <TabbedForm>
                <TabbedForm.Tab label={translate(`activities.form.mainInfos`)}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.title`)}</Typography>
                            <OutlinedInput
                                name="title"
                                onChange={(e) => setNewTitle(e.target.value)}
                                type="text"
                                value={newTitle}
                                required
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <Box>
                                <Typography variant="subtitle1">{translate(`activities.form.image`)}</Typography>
                                <ImageUploader onImageSelect={setNewImage} source="image.id" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1">{translate(`activities.form.imageCredit`)}</Typography>
                                <OutlinedInput
                                    name="imageCredit"
                                    onChange={(e) => setNewImageCredit(e.target.value)}
                                    type="text"
                                    value={newImageCredit}
                                    required
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.description`)}</Typography>
                            <OutlinedInput
                                name="description"
                                onChange={(e) => setNewDescription(e.target.value)}
                                type="text"
                                value={newDescription}
                                multiline
                                required
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.language`)}</Typography>
                            <Select onChange={(e: any) => setNewLanguage(e.target.value as string)} value={newLanguage}>
                                {universitiesLanguages.map((languageFromUniversity) => (
                                    <MenuItem key={languageFromUniversity} value={languageFromUniversity}>
                                        {languageFromUniversity}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.level`)}</Typography>
                            <Select onChange={(e: any) => setNewLevel(e.target.value as string)} value={newLevel}>
                                {proficiencyLevels.map((languageFromUniversity) => (
                                    <MenuItem key={languageFromUniversity} value={languageFromUniversity}>
                                        {languageFromUniversity}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.category`)}</Typography>
                            <Select
                                onChange={(e: any) => setNewThemeCategory(e.target.value as string)}
                                value={newThemeCategory}
                            >
                                {activityThemesCategories.data?.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.content}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        {newThemeCategory && (
                            <Box>
                                <Typography variant="subtitle1">{translate(`activities.form.theme`)}</Typography>
                                <Select onChange={(e: any) => setNewTheme(e.target.value as string)} value={newTheme}>
                                    {activityThemesCategories.data
                                        ?.find((category) => category.id === newThemeCategory)
                                        ?.themes.map((subcategory: ActivityTheme) => (
                                            <MenuItem key={subcategory.id} value={subcategory.id}>
                                                {subcategory.content}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        )}

                        <Box>
                            <Typography variant="subtitle1">{translate(`activities.form.ressource`)}</Typography>
                            {ressourceChoice === null && (
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        onClick={() => setRessourceChoice('url')}
                                        sx={{ paddingLeft: '20px' }}
                                        variant="outlined"
                                    >
                                        <span>{translate(`activities.form.url`)}</span>
                                    </Button>
                                    <Button
                                        onClick={() => setRessourceChoice('file')}
                                        sx={{ paddingLeft: '20px' }}
                                        variant="outlined"
                                    >
                                        <span>{translate(`activities.form.file`)}</span>
                                    </Button>
                                </Box>
                            )}
                            {ressourceChoice === 'url' && (
                                <>
                                    <Typography variant="subtitle1">
                                        {translate(`activities.form.ressourceURL`)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <OutlinedInput
                                            name="description"
                                            onChange={(e) => setNewResourceURL(e.target.value)}
                                            type="text"
                                            value={newResourceURL}
                                            required
                                        />
                                        <Button onClick={() => setRessourceChoice(null)}>
                                            <CloseIcon />
                                        </Button>
                                    </Box>
                                </>
                            )}
                            {ressourceChoice === 'file' && (
                                <>
                                    <Typography variant="subtitle1">
                                        {translate(`activities.form.ressourceFile`)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <FileUploader onFileSelect={setNewResourceFile} />
                                        <Button onClick={() => setRessourceChoice(null)}>
                                            <CloseIcon />
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </TabbedForm.Tab>

                <TabbedForm.Tab label={translate(`activities.form.exercices`)}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="h4">{translate(`activities.form.exercices`)}</Typography>

                        {newExercises
                            .sort((a, b) => a.order - b.order)
                            .map((exercise, index) => (
                                <Box key={exercise.order} sx={{ marginBottom: '20px' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle1">
                                            {translate(`activities.form.exercice`)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: '30px' }}>
                                            {index > 0 && (
                                                <KeyboardArrowUpIcon onClick={() => onUpExcercisePressed(index)} />
                                            )}
                                            {index < newExercises.length - 1 && (
                                                <KeyboardArrowDownIcon onClick={() => onDownExcercisePressed(index)} />
                                            )}
                                            {newExercises.length > 3 && (
                                                <DeleteIcon onClick={() => onDeleteExcercisePressed(index)} />
                                            )}
                                        </Box>
                                    </Box>
                                    <OutlinedInput
                                        name="exercices"
                                        onChange={(e) => onContentExcerciseChange(e.target.value, exercise?.order)}
                                        type="text"
                                        value={exercise?.content}
                                        multiline
                                        required
                                    />
                                </Box>
                            ))}

                        <Button onClick={onAddExcercisePressed} variant="outlined">
                            <span>{translate(`activities.form.addExercice`)}</span>
                        </Button>
                    </Box>
                </TabbedForm.Tab>

                <TabbedForm.Tab label={translate(`activities.form.vocabulary`)}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography variant="h4">{translate(`activities.form.vocabulary`)}</Typography>

                        {newVocabulary.map((vocabulary, index) => (
                            <Box
                                key={vocabulary.id}
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        border: '1px solid #e0e0e0',
                                        padding: '10px',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <OutlinedInput
                                        name="vocabulary"
                                        onChange={(e) => onUpdateContentVocabulary(e.target.value, index)}
                                        placeholder={translate(`activities.form.vocabularyPlaceholder`)}
                                        type="text"
                                        value={vocabulary.content}
                                        required
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span>{translate('activities.form.pronunciation')}</span>
                                            {vocabulary.file && (
                                                <AudioLine audioFile={vocabulary.file} hideProgressBar />
                                            )}
                                        </Box>
                                        {vocabulary.file ? (
                                            <Button onClick={() => onDeletePronunciation(index)}>
                                                <span>{translate(`activities.form.deletePronunciation`)}</span>
                                            </Button>
                                        ) : (
                                            <RecordingButton
                                                handleStartRecord={() => handleStartRecord()}
                                                handleStopRecord={() => handleStopRecord(index)}
                                                hasPermission={hasPermission}
                                                mode="record"
                                            />
                                        )}
                                    </Box>
                                </Box>
                                <DeleteIcon onClick={() => handleDeleteVocabulary(index)} />
                            </Box>
                        ))}

                        <Button onClick={onAddVocabularyPressed} variant="outlined">
                            <span>{translate(`activities.form.addVocabulary`)}</span>
                        </Button>
                    </Box>
                </TabbedForm.Tab>
            </TabbedForm>

            <Button
                color="primary"
                disabled={
                    !newTitle ||
                    !newDescription ||
                    !newImage ||
                    !newLanguage ||
                    !newLevel ||
                    !newTheme ||
                    (!newResourceFile && !newResourceURL) ||
                    newExercises.some((exercise) => !exercise.content)
                }
                onClick={onCreatePressed}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ActivityForm;
