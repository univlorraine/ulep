import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList } from 'react-admin';
import Quizz from '../entities/Quizz';

interface QuizzLevelPickerProps {
    onChange: (value: string) => void;
    value?: string;
}

const QuizzLevelPicker: React.FC<QuizzLevelPickerProps> = ({ onChange, value }) => {
    const { data } = useGetList('proficiency/tests');

    if (!data) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="quizz-level-picker"
                onChange={(quizz) => onChange(quizz.target.value)}
                sx={{ mx: 4, my: 2 }}
                value={value ?? ''}
                variant="standard"
            >
                {data.map((quizz: Quizz) => (
                    <MenuItem key={quizz.id} value={quizz.id}>
                        {quizz.level}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default QuizzLevelPicker;
