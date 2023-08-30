import Chip from '@material-ui/core/Chip';
import React from 'react';

interface TextArrayFieldProps {
    record: any;
    source: string;
}
const TextArrayField: React.FC<TextArrayFieldProps> = ({ record, source }) => {
    const array = record[source];
    if (typeof array === 'undefined' || array === null || array.length === 0) {
        return <div />;
    }

    return (
        <>
            {array.map((item: any) => (
                <Chip key={item} label={item} />
            ))}
        </>
    );
};

export default TextArrayField;
