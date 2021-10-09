import React from 'react'
import styled from 'styled-components'
import { Grid, Button, ButtonBase, Typography } from '@material-ui/core'
import { EmailOutlined } from '@material-ui/icons'
/*  padding-left: 18px;
    padding-right: 18px;
    padding-top: 12px;
    padding-bottom: 12px;
    */
   
const StyledButton = styled(ButtonBase)`
    position: relative;
    width: 100%;
    padding: 10px;
    border-radius: 24px;
    border-color: #222222;
    border-width: 2px;
    border-style: solid;
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
        <StyledButton onClick={props.onClick}>
            <StyledIconArea>
                {props.isSVG ? <img style={{ 'verticalAlign': 'middle', 'height': '1.5rem', 'width': '1.5rem' }} src={props.icon} />
                    : <StyledIconComp as={props.icon} />}
            </StyledIconArea>
            <Typography style={{textTransform:'none'}} variant='button'>{props.text}</Typography>
        </StyledButton>
    )
}
