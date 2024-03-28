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
            main: '#FFFFFF',
            contrastText: '#212121',
        },
        secondary: {
            main: '#fdee66',
            contrastText: '#212121',
        },
    } as PaletteOptions,
    typography: {
        fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
        body1: {
            fontSize: '1rem',
            color: '#212121',
        },
        h1: {
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#212121',
        },
    },
    components: {
        ...defaultTheme.components,
        MuiDivider: {
            styleOverrides: {
                root: {
                    margin: '8px 0',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #e0e0e0',
                    boxShadow: 'none',
                    '& .MuiToolbar-root': {
                        gap: '16px',
                    },
                },
            },
        },
        RaSidebar: {
            styleOverrides: {
                root: {
                    borderRight: '1px solid #e0e0e0',
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
                    '& .RaLoadingIndicator-loader': {
                        left: '45%',
                        top: '6px',
                    },
                },
            },
        },
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    lineHeight: '2.2',
                    color: '#212121',
                    fontSize: '0.9rem',
                    '& .RaMenuItemLink-icon': {
                        marginRight: '10px',
                    },
                    '&.RaMenuItemLink-active': {
                        backgroundColor: '#fdee66',
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
};

export default theme;
