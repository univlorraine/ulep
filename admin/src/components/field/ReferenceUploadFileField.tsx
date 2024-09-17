import get from 'lodash/get';
import { FieldProps, FileField, useGetOne, useRecordContext } from 'react-admin';

const ReferenceUploadFileField = <RecordType extends Record<string, any> = Record<string, any>>({
    label,
    source,
}: FieldProps<RecordType>) => {
    const record = useRecordContext();
    const sourceValue = get(record, source as string);

    if (!sourceValue) {
        return null;
    }

    const { data, isLoading, error } = useGetOne('uploads', { id: sourceValue });

    if (isLoading || error) {
        return null;
    }

    return <FileField label={label} record={data} source="url" title={data.name.split('/').pop()} />;
};

export default ReferenceUploadFileField;
