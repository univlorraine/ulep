import { PaletteOptions } from '@mui/material';
import { RaThemeOptions, defaultTheme } from 'react-admin';

const theme: RaThemeOptions = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#212121',
        },
        secondary: {
            main: '#fdee66',
            contrastText: '#212121',
        },
    } as PaletteOptions,
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        body1: {
            fontSize: '1rem',
            color: '#212121',
        },
        h1: {
            fontSize: '1.2rem',
            fontWeight: '600',
        },
        h2: {
            fontSize: '2.4rem',
            fontWeight: '400',
            padding: '16px 0',
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
        RaLayout: {
            styleOverrides: {
                root: {
                    '& .RaLayout-appFrame': {
                        marginTop: '56px',
                    },
                    '& .RaLayout-content': {
                        padding: '46px 21px',
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
                    lineHeight: '2.4',
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
                        backgroundColor: '#fdee66',
                        color: '#212121',
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
