import { PaletteOptions } from '@mui/material';
import { RaThemeOptions, defaultTheme } from 'react-admin';

const colors = {
    black: '000000',
    white: 'FFFFFF',
    grey: '767676',
    greyLight: 'ECEDED',
    green: 'F60C36',
    yellowLight: 'FDEE66',
    orange: 'FF8700',
    red: 'F60C36',
};

console.log(colors);

const theme: RaThemeOptions = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#fdee66',
        },
    } as PaletteOptions,
    components: {
        ...defaultTheme.components,
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'none',
                    '& .MuiToolbar-root': {
                        gap: '16px',
                    },
                },
            },
        },
        RaLoadingIndicator: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    borderRadius: '4px',
                    boxShadow:
                        '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
                    '& .RaLoadingIndicator-loadedIcon': {
                        padding: '4px 10px',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        fontWeight: '500',
                        '& svg': {
                            width: '18px',
                            height: '18px',
                        },
                    },
                    '& .RaLoadingIndicator-loadedIcon::after': {
                        content: '"Actualiser"',
                        marginLeft: '5px',
                    },
                },
            },
        },
        RaChipField: {
            styleOverrides: {
                root: {
                    '&.RaChipField-chip': {
                        backgroundColor: '#FFBF46',
                        color: '#575761',
                    },
                },
            },
        },
    },
    sidebar: {
        width: 260,
        closedWidth: 55,
    },
    typography: {
        fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
    },
};

export default theme;
