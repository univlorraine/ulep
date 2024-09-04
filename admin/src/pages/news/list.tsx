import React from 'react';
import { List, Datagrid, useTranslate, TextField, FunctionField } from 'react-admin';
import ColoredChips, { ChipsColors } from '../../components/ColoredChips';
import PageTitle from '../../components/PageTitle';
import { NewsStatus } from '../../entities/News';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const StatusChips = ({ status }: { status: string }) => {
    const translate = useTranslate();

    let color: ChipsColors = 'default';
    switch (status) {
        case NewsStatus.DRAFT:
            color = 'default';
            break;
        case NewsStatus.PUBLISHED:
            color = 'success';
            break;
    }

    return <ColoredChips color={color} label={translate(`news.status.${status}`)} />;
};

const NewsList = () => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('news.title')}</PageTitle>
            <List exporter={false}>
                <Datagrid bulkActionButtons={false}>
                    <TextField label="news.list.title" source="title" />
                    <TextField label="news.list.university" source="university.name" />
                    <FunctionField
                        label="news.list.defaultLanguage"
                        render={(record: any) => codeLanguageToFlag(record.languageCode)}
                    />
                    <FunctionField
                        label="news.list.translations"
                        render={(record: any) => {
                            console.log({ record });

                            return record.translations
                                .map((translation: any) => codeLanguageToFlag(translation.languageCode))
                                .join(', ');
                        }}
                    />
                    <FunctionField
                        label="news.list.status"
                        render={(record: any) => <StatusChips status={record.status} />}
                    />
                </Datagrid>
            </List>
        </>
    );
};

export default NewsList;
