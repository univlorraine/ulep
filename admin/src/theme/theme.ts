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
        info: {
            main: '#2196f3',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ff8700',
            contrastText: '#ffffff',
        },
    } as PaletteOptions,
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        body1: {
            fontSize: '0.875rem',
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
        h3: {
            fontSize: '1.2rem',
            fontWeight: '600',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '10px',
            marginBottom: '10px',
        },
        h4: {
            fontSize: '1rem',
            fontWeight: '600',
        },
        subtitle1: {
            fontSize: '0.875rem',
            color: '#212121',
            fontWeight: '700',
        },
    },
    components: {
        ...defaultTheme.components,
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
        MuiDivider: {
            styleOverrides: {
                root: {
                    margin: '8px 0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    '&.RaDatagrid-headerCell': {
                        fontWeight: 'bold',
                    },
                },
            },
        },
        RaCreateButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '5px 9px',
                    boxShadow:
                        '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
                    '&:hover': {
                        backgroundColor: '#212121',
                    },
                    border: 'none !important',
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
        RaList: {
            styleOverrides: {
                root: {
                    '& .RaList-content': {
                        boxShadow: 'none',
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
        RaSidebar: {
            styleOverrides: {
                root: {
                    borderRight: '1px solid #e0e0e0',
                },
            },
        },
        RaTabbedShowLayout: {
            styleOverrides: {
                root: {
                    '& .RaTabbedShowLayout-content': {
                        padding: '0',
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
