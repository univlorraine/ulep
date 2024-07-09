import Chip from '@mui/material/Chip';
import React from 'react';

export type ChipsColors = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default' | undefined;

type ColoredChipsProps = {
    color: ChipsColors;
    label: string | number;
    variant?: 'filled' | 'outlined';
};

const ColoredChips = ({ color, label, variant = 'filled' }: ColoredChipsProps) => (
    <Chip color={color} label={label} variant={variant} />
);

export default ColoredChips;
