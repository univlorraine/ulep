import { IonButton, IonIcon, IonImg, IonText } from '@ionic/react';
import { addSharp, closeCircle, documentOutline, trashBinOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { Activity, ActivityTheme, ActivityThemeCategory } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import { codeLanguageToFlag } from '../../../utils';
import Dropdown, { DropDownItem } from '../../DropDown';
import RequiredField from '../../forms/RequiredField';
import TextInput from '../../TextInput';
import styles from './CreateActivityInformationsContent.module.css';
import { CreateActivityInformationsOutput, UpdateActivityInformationsOutput } from './CreateOrUpdateActivityContent';

interface CreateActivityInformationsContentProps {
    onBackPressed: () => void;
    onSubmit: (data: CreateActivityInformationsOutput | UpdateActivityInformationsOutput) => void;
    activityThemesCategoryDropDown: DropDownItem<ActivityThemeCategory>[];
    cefrLevelsDropDown: DropDownItem<CEFR>[];
    languagesDropDown: DropDownItem<Language>[];
    activityToUpdate?: Activity;
}

export const CreateActivityInformationsContent = ({
    onSubmit,
    onBackPressed,
    activityThemesCategoryDropDown,
    cefrLevelsDropDown,
    languagesDropDown,
    activityToUpdate,
}: CreateActivityInformationsContentProps) => {
    const { t } = useTranslation();
    const { cameraAdapter, fileAdapter } = useConfig();
    const [title, setTitle] = useState<string>(activityToUpdate?.title ?? '');
    const [image, setImage] = useState<File>();
    const [creditImage, setCreditImage] = useState<string | undefined>(activityToUpdate?.creditImage);
    const [hideUrlImage, setHideUrlImage] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(activityToUpdate?.description ?? '');
    const [language, setLanguage] = useState<Language | undefined>(activityToUpdate?.language);
    const [selectedThemeCategory, setSelectedThemeCategory] = useState<ActivityThemeCategory | undefined>();
    const [selectableThemesDropDown, setSelectableThemesDropDown] = useState<DropDownItem<ActivityTheme>[]>([]);
    const [theme, setTheme] = useState<ActivityTheme | undefined>(activityToUpdate?.activityTheme);
    const [level, setLevel] = useState<CEFR | undefined>(activityToUpdate?.languageLevel);
    const [ressourceUrl, setRessourceUrl] = useState<string | undefined>(activityToUpdate?.ressourceUrl);
    const [ressourceFile, setRessourceFile] = useState<File>();
    const [isRessourceUrl, setIsRessourceUrl] = useState<boolean>(!!activityToUpdate?.ressourceUrl);
    const [hideRessourceActivity, setHideRessourceActivity] = useState<boolean>(false);

    const imageRef = useRef<string | undefined>(activityToUpdate?.imageUrl);

    useEffect(() => {
        if (selectedThemeCategory) {
            setTheme(selectedThemeCategory.themes[0]);
            setSelectableThemesDropDown(
                selectedThemeCategory.themes.map((theme) => ({
                    label: theme.content,
                    value: theme,
                }))
            );
        }
    }, [selectedThemeCategory]);

    const findAndSetActivityThemeCategory = (activityToUpdate: Activity | undefined) => {
        if (!activityToUpdate) return;

        const activityThemeCategory = activityThemesCategoryDropDown.find((category) =>
            category.value.themes.some((theme) => theme.id === activityToUpdate.activityTheme?.id)
        )?.value;

        if (activityThemeCategory) {
            setSelectedThemeCategory(activityThemeCategory);
            setSelectableThemesDropDown(
                activityThemeCategory.themes.map((theme) => ({
                    label: theme.content,
                    value: theme,
                })) as DropDownItem<ActivityTheme>[]
            );
        }
    };

    const findAndSetLanguage = (activityToUpdate: Activity | undefined) => {
        if (!activityToUpdate) return;

        const language = languagesDropDown.find((language) => language.value.code === activityToUpdate.language.code);

        if (language) {
            setLanguage(language.value);
        }
    };

    useEffect(() => {
        findAndSetActivityThemeCategory(activityToUpdate);
        findAndSetLanguage(activityToUpdate);
    }, [activityToUpdate, activityThemesCategoryDropDown, languagesDropDown, cefrLevelsDropDown]);

    const onImagePressed = async () => {
        const image = await cameraAdapter.getPictureFromGallery();

        if (image) {
            setImage(image);
            imageRef.current = URL.createObjectURL(image);
        }
    };

    const onRessourcePressed = async () => {
        const ressource = await fileAdapter.getFile({ isTypeOnlyPdf: true });

        if (ressource) {
            setRessourceFile(ressource);
        }
    };

    const allRequiredFieldsAreFilled = () => {
        return (
            title &&
            (image || (activityToUpdate?.imageUrl && !hideUrlImage)) &&
            description &&
            language &&
            level &&
            theme &&
            (ressourceUrl || (activityToUpdate?.ressourceFileUrl && !hideRessourceActivity) || ressourceFile)
        );
    };

    const clearImage = () => {
        setImage(undefined);
        setHideUrlImage(true);
        imageRef.current = undefined;
    };

    const clearRessource = () => {
        setRessourceFile(undefined);
        setRessourceUrl(undefined);
        setHideRessourceActivity(true);
        setIsRessourceUrl(false);
    };

    const handleSubmit = () => {
        if (!allRequiredFieldsAreFilled()) {
            return;
        }

        onSubmit({
            title,
            description,
            language: language!,
            level: level!,
            theme: theme!,
            image,
            creditImage,
            ressourceUrl,
            ressource: ressourceFile,
        });
    };

    const showFileRessource = ressourceFile || (activityToUpdate?.ressourceFileUrl && !hideRessourceActivity);
    const imageToDisplay = imageRef.current ?? activityToUpdate?.imageUrl;

    return (
        <div>
            <p className="title">{t('activity.create.title_informations')}</p>
            <TextInput
                title={t('activity.create.title_input') as string}
                onChange={(text) => setTitle(text)}
                value={title}
                placeholder={t('activity.create.title_input_placeholder') as string}
                maxLength={150}
                required
            />

            <span className={styles['input-label']}>
                {t('activity.create.image')} <RequiredField />
            </span>
            {!image && (!activityToUpdate?.imageUrl || hideUrlImage) ? (
                <IonButton fill="clear" className="tertiary-button no-padding margin-bottom" onClick={onImagePressed}>
                    <IonIcon icon={addSharp} />
                    {t('activity.create.image_button')}
                </IonButton>
            ) : (
                <div className={`${styles.imageContainer} margin-bottom`}>
                    <IonImg
                        alt={t('activity.create.image_alt') as string}
                        className={styles.image}
                        src={imageToDisplay}
                    />
                    <IonButton
                        fill="clear"
                        className="image"
                        onClick={clearImage}
                        aria-label={t('activity.create.delete_image_button') as string}
                    >
                        <IonIcon icon={trashBinOutline} color="dark" aria-hidden />
                    </IonButton>
                </div>
            )}
            <TextInput
                title=""
                onChange={(text) => setCreditImage(text)}
                value={creditImage ?? ''}
                placeholder={t('activity.create.credit_image_placeholder') as string}
            />

            <TextInput
                title={t('activity.create.description') as string}
                onChange={(text) => setDescription(text)}
                value={description}
                placeholder={t('activity.create.description_placeholder') as string}
                type="text-area"
                maxLength={1000}
                showLimit
                required
            />

            <Dropdown<Language>
                title={t('activity.create.language') as string}
                options={languagesDropDown}
                onChange={(text) => setLanguage(text)}
                placeholder={t('activity.create.language_placeholder') as string}
                value={
                    language
                        ? { label: `${codeLanguageToFlag(language.code)} ${language.name}`, value: language }
                        : undefined
                }
                required
            />

            <Dropdown<CEFR>
                title={t('activity.create.level') as string}
                onChange={(text) => setLevel(text)}
                options={cefrLevelsDropDown}
                placeholder={t('activity.create.level_placeholder') as string}
                value={level ? { label: level, value: level } : undefined}
                required
            />

            <Dropdown<ActivityThemeCategory>
                title={t('activity.create.theme_category') as string}
                onChange={(themeCategory) => setSelectedThemeCategory(themeCategory)}
                options={activityThemesCategoryDropDown}
                placeholder={t('activity.create.theme_category_placeholder') as string}
                value={
                    selectedThemeCategory
                        ? { label: selectedThemeCategory.content, value: selectedThemeCategory }
                        : undefined
                }
                required
            />

            {selectedThemeCategory && (
                <Dropdown<ActivityTheme>
                    title={t('activity.create.theme') as string}
                    onChange={(theme) => setTheme(theme)}
                    options={selectableThemesDropDown}
                    placeholder={t('activity.create.theme_placeholder') as string}
                    value={theme ? { label: theme.content, value: theme } : undefined}
                    required
                />
            )}

            <div className="margin-top">
                <span className={`${styles['input-label']} margin-top`}>
                    {t('activity.create.ressource')} <RequiredField />
                </span>
            </div>
            {!isRessourceUrl &&
                (!activityToUpdate?.ressourceFileUrl || !activityToUpdate?.ressourceUrl || hideRessourceActivity) &&
                !ressourceFile && (
                    <>
                        <div className={`${styles['button-container']}`}>
                            <IonButton
                                fill="clear"
                                className="tertiary-button no-padding"
                                onClick={() => setIsRessourceUrl(true)}
                            >
                                {t('activity.create.ressource_url')}
                            </IonButton>
                            <IonButton fill="clear" className="tertiary-button no-padding" onClick={onRessourcePressed}>
                                {t('activity.create.ressource_file')}
                            </IonButton>
                        </div>
                        <span className={styles.infos}>{t('activity.create.ressource_infos')}</span>
                    </>
                )}
            {isRessourceUrl && !showFileRessource && (
                <div className={styles.imageContainer}>
                    <TextInput
                        title={''}
                        onChange={(text) => setRessourceUrl(text)}
                        value={ressourceUrl ?? ''}
                        placeholder={t('activity.create.ressource_url_placeholder') as string}
                    />
                    <IonButton
                        fill="clear"
                        onClick={clearRessource}
                        aria-label={t('activity.create.close_ressource_url') as string}
                    >
                        <IonIcon icon={closeCircle} color="dark" aria-hidden />
                    </IonButton>
                </div>
            )}
            {showFileRessource && (
                <div className={styles.ressourceContainer}>
                    <IonIcon className={styles.ressourceIcon} icon={documentOutline} color="dark" />
                    <IonText className={styles.ressourceTitle}>
                        {ressourceFile?.name || activityToUpdate?.title}
                    </IonText>
                    <IonButton
                        className={styles.closeButton}
                        fill="clear"
                        onClick={clearRessource}
                        aria-label={t('activity.create.close_ressource_file') as string}
                    >
                        <IonIcon icon={closeCircle} color="dark" aria-hidden />
                    </IonButton>
                </div>
            )}

            <div className={`${styles['button-container']} large-margin-top`}>
                <IonButton fill="clear" className="tertiary-button no-padding" onClick={onBackPressed}>
                    {t('activity.create.cancel_button')}
                </IonButton>
                <IonButton
                    fill="clear"
                    className={`primary-button no-padding ${!allRequiredFieldsAreFilled() ? 'disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!allRequiredFieldsAreFilled()}
                >
                    {t('activity.create.validate_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default CreateActivityInformationsContent;
