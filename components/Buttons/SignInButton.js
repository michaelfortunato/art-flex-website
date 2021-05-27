import React from 'react'
import styled from 'styled-components'
import { Grid, Button, ButtonBase, Typography } from '@material-ui/core'
import { EmailOutlined } from '@material-ui/icons'
const StyledButton = styled(ButtonBase)`
    && {
        width: 60%;
        height: 100%;
        border: 1px #000 solid;
        padding: 10px;
        border-radius: 50px;
        margin: 0;
        justify-content: flex-start;
    }
`
const StyledIconArea = styled.div`
    display: inline-block;
    margin-left: 8px;
    margin-right: 10px;
`
const StyledIconComp = styled.i`
    vertical-align: middle; 
    height: 25px;
    width: 25px; 
`;
export default function SignInButton(props) {
    return (
        <StyledButton onClick = {props.onClick}>
            <StyledIconArea>
                {props.isSVG ? <img style={{ 'verticalAlign': 'middle', 'height': '25px', 'width': '25px' }} src={props.icon} />
                    : <StyledIconComp as={props.icon} />}
            </StyledIconArea>
            <Typography>{props.text}</Typography>
        </StyledButton>
    )
}
