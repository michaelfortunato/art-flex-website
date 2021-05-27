import React from 'react'
import styled from 'styled-components'
import { Grid, Button, ButtonBase, Typography } from '@material-ui/core'
import { EmailOutlined } from '@material-ui/icons'
import SignInButton from './SignInButton'
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
const StyledIcon = styled.div`
    display: inline-block;
    margin-left: 8px;
    margin-right: 10px;
`

export default function EmailSignInButton(props) {
    const onClickHandler = () => {
        props.setPageNumber(1);
    }
    return (
        <SignInButton onClick={onClickHandler} text={"Sign in with your Email"} icon={EmailOutlined}/>
    )
}
