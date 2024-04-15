import Chip from '@mui/material/Chip';
import React from 'react';

type ColoredChipsProps = {
    color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default' | undefined;
    label: string;
};

const ColoredChips = ({ color, label }: ColoredChipsProps) => <Chip color={color} label={label} />;

export default ColoredChips;
