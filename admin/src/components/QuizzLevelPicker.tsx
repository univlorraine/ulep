import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList } from 'react-admin';
import Quizz from '../entities/Quizz';

interface QuizzLevelPickerProps {
    onChange: (value: string) => void;
    value?: string;
}

const QuizzLevelPicker: React.FC<QuizzLevelPickerProps> = ({ onChange, value }) => {
    const { data, isLoading } = useGetList('proficiency/tests');

    if (isLoading || !data) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="quizz-level-picker"
                onChange={(quizz) => onChange(quizz.target.value)}
                sx={{ mx: 4, my: 2 }}
                value={value ?? ''}
                disableUnderline
            >
                {data.map((quizz: Quizz) => (
                    <MenuItem key={quizz.id} value={quizz.level}>
                        {quizz.level}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default QuizzLevelPicker;
