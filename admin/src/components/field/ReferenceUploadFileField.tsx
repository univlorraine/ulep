import get from 'lodash/get';
import { FieldProps, FileField, useGetOne, useRecordContext, useTranslate } from 'react-admin';

const ReferenceUploadFileField = <RecordType extends Record<string, any> = Record<string, any>>({
    label,
    source,
}: FieldProps<RecordType>) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const sourceValue = get(record, source as string);

    if (!sourceValue) {
        return <>{translate('ra.navigation.no_results')}</>;
    }

    const { data, isLoading, error } = useGetOne('uploads', { id: sourceValue });

    if (isLoading || error) {
        return null;
    }

    return <FileField label={label} record={data} source="url" title={data.name.split('/').pop()} />;
};

export default ReferenceUploadFileField;
