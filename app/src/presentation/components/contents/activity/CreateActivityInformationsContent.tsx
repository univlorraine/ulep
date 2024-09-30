import { IonButton, IonIcon, IonImg, IonText } from '@ionic/react';
import { addSharp, closeCircle, documentOutline, trashBinOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../../context/ConfigurationContext';
import { ActivityTheme } from '../../../../domain/entities/Activity';
import Language from '../../../../domain/entities/Language';
import Dropdown, { DropDownItem } from '../../DropDown';
import RequiredField from '../../forms/RequiredField';
import TextInput from '../../TextInput';
import { CreateActivityInformationsOutput } from './CreateActivityContent';
import styles from './CreateActivityInformationsContent.module.css';

interface CreateActivityInformationsContentProps {
    onBackPressed: () => void;
    onSubmit: (data: CreateActivityInformationsOutput) => void;
    activityThemesDropDown: DropDownItem<ActivityTheme>[];
    cefrLevelsDropDown: DropDownItem<CEFR>[];
    languagesDropDown: DropDownItem<Language>[];
}

export const CreateActivityInformationsContent = ({
    onSubmit,
    onBackPressed,
    activityThemesDropDown,
    cefrLevelsDropDown,
    languagesDropDown,
}: CreateActivityInformationsContentProps) => {
    const { t } = useTranslation();
    const { cameraAdapter, fileAdapter } = useConfig();
    const [title, setTitle] = useState<string>('');
    const [image, setImage] = useState<File>();
    const [creditImage, setCreditImage] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [language, setLanguage] = useState<Language>();
    const [theme, setTheme] = useState<ActivityTheme>();
    const [level, setLevel] = useState<CEFR>();
    const [ressourceUrl, setRessourceUrl] = useState<string>('');
    const [ressourceFile, setRessourceFile] = useState<File>();
    const [isRessourceUrl, setIsRessourceUrl] = useState<boolean>(false);

    const onImagePressed = async () => {
        const image = await cameraAdapter.getPictureFromGallery();

        if (image) {
            setImage(image);
        }
    };

    const onRessourcePressed = async () => {
        const ressource = await fileAdapter.getFile({ isTypeOnlyPdf: true });

        if (ressource) {
            setRessourceFile(ressource);
        }
    };

    const allRequiredFieldsAreFilled = () => {
        return title && image && description && language && level && theme && (ressourceUrl || ressourceFile);
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
            image: image!,
            creditImage,
            ressourceUrl,
            ressource: ressourceFile,
        });
    };

    return (
        <div>
            <p className="title">{t('activity.create.title_informations')}</p>
            <TextInput
                title={t('activity.create.title_input') as string}
                onChange={(text) => setTitle(text)}
                value={title}
                placeholder={t('activity.create.title_input_placeholder') as string}
                maxLength={50}
                required
            />

            <span className={styles['input-label']}>
                {t('activity.create.image')} <RequiredField />
            </span>
            {!image ? (
                <IonButton fill="clear" className="tertiary-button no-padding margin-bottom" onClick={onImagePressed}>
                    <IonIcon icon={addSharp} />
                    {t('activity.create.image_button')}
                </IonButton>
            ) : (
                <div className={`${styles.imageContainer} margin-bottom`}>
                    <IonImg className={styles.image} src={URL.createObjectURL(image)} />
                    <IonButton
                        fill="clear"
                        className="image"
                        onClick={() => setImage(undefined)}
                        aria-label={t('activity.create.delete_image_button') as string}
                    >
                        <IonIcon icon={trashBinOutline} color="dark" aria-hidden />
                    </IonButton>
                </div>
            )}
            <TextInput
                title=""
                onChange={(text) => setCreditImage(text)}
                value={creditImage}
                placeholder={t('activity.create.credit_image_placeholder') as string}
            />

            <TextInput
                title={t('activity.create.description') as string}
                onChange={(text) => setDescription(text)}
                value={description}
                placeholder={t('activity.create.description_placeholder') as string}
                type="text-area"
                maxLength={100}
                required
            />

            <Dropdown<Language>
                title={t('activity.create.language') as string}
                options={languagesDropDown}
                onChange={(text) => setLanguage(text)}
                placeholder={t('activity.create.language_placeholder') as string}
                required
            />

            <Dropdown<CEFR>
                title={t('activity.create.level') as string}
                onChange={(text) => setLevel(text)}
                options={cefrLevelsDropDown}
                placeholder={t('activity.create.level_placeholder') as string}
                required
            />

            <Dropdown<ActivityTheme>
                title={t('activity.create.theme') as string}
                onChange={(text) => setTheme(text)}
                options={activityThemesDropDown}
                placeholder={t('activity.create.theme_placeholder') as string}
                required
            />

            <div className="margin-top">
                <span className={`${styles['input-label']} margin-top`}>
                    {t('activity.create.ressource')} <RequiredField />
                </span>
            </div>
            {!isRessourceUrl && !ressourceFile && (
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
            {isRessourceUrl && (
                <div className={styles.imageContainer}>
                    <TextInput
                        title={''}
                        onChange={(text) => setRessourceUrl(text)}
                        value={ressourceUrl}
                        placeholder={t('activity.create.ressource_url_placeholder') as string}
                    />
                    <IonButton
                        fill="clear"
                        onClick={() => setIsRessourceUrl(false)}
                        aria-label={t('activity.create.close_ressource_url') as string}
                    >
                        <IonIcon icon={closeCircle} color="dark" aria-hidden />
                    </IonButton>
                </div>
            )}
            {ressourceFile && (
                <div className={styles.ressourceContainer}>
                    <IonIcon className={styles.ressourceIcon} icon={documentOutline} color="dark" />
                    <IonText className={styles.ressourceTitle}>{ressourceFile.name}</IonText>
                    <IonButton
                        className={styles.closeButton}
                        fill="clear"
                        onClick={() => setRessourceFile(undefined)}
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
