import { createTheme } from '@material-ui/core/styles';


const theme = createTheme(
    {
        palette: {
            type: 'light',
            primary: {
                main: '#673ab7',
            },
            secondary: {
                main: '#ffea00',
            },
            warning: {
                main: '#fb8c00',
            },
        },
    }
);

export default theme;