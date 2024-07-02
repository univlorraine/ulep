import Chip from '@mui/material/Chip';
import React from 'react';

export type ChipsColors = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default' | undefined;

type ColoredChipsProps = {
    color: ChipsColors;
    label: string | number;
};

const ColoredChips = ({ color, label }: ColoredChipsProps) => <Chip color={color} label={label} />;

export default ColoredChips;
