import { createTheme } from '@material-ui/core/styles';
import { defaultTheme } from 'react-admin';

const theme = createTheme({
    ...defaultTheme,
    palette: {
        primary: {
            main: '#575761',
        },
        secondary: {
            main: '#FFBF46',
        },
        trasnparentPrimary: {
            main: '#57576111',
        },
    },
    components: {
        ...defaultTheme.components,
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
});

export default theme;
