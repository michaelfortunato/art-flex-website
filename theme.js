import { createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme(
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