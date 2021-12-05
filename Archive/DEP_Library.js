// Consitently re-used components
import {
    Grid,
    Paper,
    Typography,
    useTheme,
    InputBase,
    InputAdornment,
    IconButton,
    Button
} from '@material-ui/core'
import {
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
import { forwardRef, useState } from 'react'
import styled from 'styled-components'

const StyledStandardForm = styled(InputBase)
    `
    -webkit-appearance: none;
    -ms-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #FFFFFF;
    box-shadow: 0 1px 4px 0 rgb(34 34 34 / 10%) inset;
    border-color: rgba(34, 34, 34, 0.15);
    border-style: solid;
    border-width: 1px;
    border-radius: 6px;
    color: #222222;
    display: block;
    font-family: inherit;
    font-size: 16px;
    line-height: 28px;
    height: 48px;
    outline: none;
    padding-top: 9px;
    padding-bottom: 9px;
    padding-left: 12px;
    padding-right: 12px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    `

const StandardForm = (props) => {
    return <div>
        <div style={{ paddingLeft: 2 }}><Typography><b>{props.text}</b></Typography></div>
        <StyledStandardForm type={props.type} onChange={props.onChange} />
    </div>

}

const PasswordForm = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return <div>
        <div style={{ paddingLeft: 2 }}><Typography><b>{props.text}</b></Typography></div>
        <StyledStandardForm
            style={{ cursor: 'text', display: 'inline-flex' }}
            fullWidth
            type={showPassword ? "text" : "password"}
            onChange={(event) => props.setPassword(event.target.value)}
            endAdornment={<InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={handleMouseDownPassword}
                >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            </InputAdornment>
            }
        />
    </div>
};

const StyledAppbarButton = styled(Button)`
    border-radius: 25px;
    margin: 10px;
    text-transform: none;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
`

const AppbarButton = forwardRef((props, ref) => {
    return (
        <StyledAppbarButton ref={ref} onClick={props.onClick}>
            <Typography variant={props.variant}>{props.text}</Typography>
        </StyledAppbarButton>)
});


export { StandardForm, PasswordForm, StyledStandardForm, AppbarButton }