import { Button, Input, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import {
    Create,
    useTranslate,
    useCreate,
    useNotify,
    useRedirect,
} from "react-admin";
import TranslationLanguagePicker from "../../components/TranslationLanguagePicker";
import Translation from "../../entities/Translation";

const CreateReportCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const [name, setName] = useState<string>();
    const [translations, setTranslations] = useState<
        { index: number; item: Translation }[]
    >([]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = {
            name,
            translations: translations
                .map((translation) => translation.item)
                .filter(
                    (translation) => translation.content && translation.language
                ),
        };
        try {
            return await create(
                "reports/categories",
                { data: payload },
                {
                    onSettled: (data: any, error: Error) => {
                        if (!error) {
                            return redirect("/reports/categories");
                        }

                        return notify("report_categories.create.error");
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify("report_categories.create.error");
        }
    };

    const onTraductionLanguageAdded = (
        value: TranslatedLanguage,
        index: number
    ) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.language = value;
        setTranslations(currentTraductions);
    };

    const onTraductionContentAdded = (value: string, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.content = value;
        setTranslations(currentTraductions);
    };

    return (
        <Create title={translate("report_categories.create.title")}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ m: 4 }}
                noValidate
            >
                <Typography variant="subtitle1">
                    {translate("report_categories.create.name")}
                </Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input
                        name="Language"
                        sx={{ mx: 4, my: 2, width: 40 }}
                        value="FR"
                    />
                    <Input
                        name="Content"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={translate(
                            "report_categories.create.content"
                        )}
                        required
                    />
                </Box>

                <Typography variant="subtitle1">
                    {translate("report_categories.create.translations")}
                </Typography>
                {translations.map((item, index) => (
                    <Box
                        key={item.index}
                        alignItems="center"
                        display="flex"
                        flexDirection="row"
                    >
                        <TranslationLanguagePicker
                            onChange={(value: TranslatedLanguage) =>
                                onTraductionLanguageAdded(value, index)
                            }
                            value={translations[index].item.language}
                        />
                        <Input
                            name={`Content${item.index}`}
                            onChange={(e) =>
                                onTraductionContentAdded(e.target.value, index)
                            }
                            placeholder={translate(
                                "report_categories.create.content"
                            )}
                            value={translations[index].item.content}
                        />
                    </Box>
                ))}

                <Box
                    alignContent="flex-start"
                    display="flex"
                    flexDirection="column"
                    sx={{ width: 300 }}
                >
                    <Button
                        onClick={() =>
                            setTranslations([
                                ...translations,
                                {
                                    index: translations.length + 1,
                                    item: new Translation("", "en"),
                                },
                            ])
                        }
                        type="button"
                    >
                        {translate("report_categories.create.new_translation")}
                    </Button>

                    <Button
                        color="primary"
                        sx={{ mt: 4 }}
                        type="submit"
                        variant="contained"
                    >
                        {translate("report_categories.create.save")}
                    </Button>
                </Box>
            </Box>
        </Create>
    );
};

export default CreateReportCategory;
