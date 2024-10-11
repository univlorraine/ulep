import get from 'lodash/get';
import { FieldProps, FileField, useGetOne, useRecordContext, useTranslate } from 'react-admin';

const UploadFileField = ({ label, id, ...props }: FieldProps<Record<string, any>> & { id: string }) => {
    const { data, isLoading, error } = useGetOne('uploads', { id });

    if (isLoading || error) {
        return null;
    }

    const fileName = data.name.split('/').pop();

    return (
        <FileField
            download={fileName}
            label={label}
            record={data}
            rel="noopener noreferrer"
            source="url"
            target="_blank"
            title={fileName}
            {...props}
        />
    );
};

const ReferenceUploadFileField = <RecordType extends Record<string, any> = Record<string, any>>({
    label,
    source,
    ...props
}: FieldProps<RecordType>) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const sourceValue = get(record, source as string);

    if (!sourceValue) {
        return <>{translate('ra.navigation.no_results')}</>;
    }

    return (
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="button" tabIndex={0}>
            <UploadFileField id={sourceValue} label={label} {...props} />
        </div>
    );
};

export default ReferenceUploadFileField;
