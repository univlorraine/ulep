// eslint-disable-next-line import/no-extraneous-dependencies
import get from 'lodash/get';
import React from 'react';
import { ImageField, useRecordContext, useGetOne, FieldProps } from 'react-admin';

const ReferenceUploadField = <RecordType extends Record<string, any> = Record<string, any>>(
    props: FieldProps<RecordType>
) => {
    const { label, source } = props;
    const record = useRecordContext();
    const sourceValue = get(record, source as string);

    if (!sourceValue) {
        return null;
    }

    const { data, isLoading, error } = useGetOne('uploads', { id: sourceValue });
    if (isLoading || error) {
        return null;
    }

    return <ImageField label={label} record={data} source="url" title={String(label)} />;
};

export default ReferenceUploadField;
