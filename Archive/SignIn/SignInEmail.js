import { Button, ButtonBase, Grid, TextField, Typography, Link } from '@material-ui/core'
import { TextFormat, ArrowBackIosOutlined } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    margin-top: 100px;
    margin-left: 10%;
    margin-right: 10%;
`
const Header = styled.div`
`

const Body = styled(Grid)`
    margin-top:10%;
`

const SignInBody = styled(Grid)`
    border-radius: 6px;
    border: 1px solid #eaecef;
    background-color: #f6f8fa; 
    height: 100%;
    aspect-ratio: 1/1;
    padding: 20px;

`

const StyledSignInButton = styled(ButtonBase)`
    && {
        padding: 20px;
        width: 211px;
        height: 56px;
        border-radius: 6px;
        background-color: #2ea44f;
    }
`

const StyledLink = styled(Link)`
    display: block;
    padding-top: 10px;
    &:hover{
        cursor: pointer;
    }
`

const Form = styled(TextField)`
    && {
        padding: 1px;
    }
    `

const StyledBackButtonContainer = styled(Grid)`
    text-align: center; 
    padding-top: 20px;
    display: inline-block;
`
const StyledBackButton = styled(ButtonBase)`
    ${({ theme }) => `
        && {
            color: ${theme.palette.primary.main};
            font-size: 16px;
        }
        `
    }

`
const StyledBackArrow = styled(ArrowBackIosOutlined)`
    vertical-align: middle;
`
const Footer = styled(Grid)`
    text-align: center;
`

export default function SignInEmail(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('') 
    return (
        <Container>
            <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
                <Grid item>
                    <Typography variant='h4'>Sign into Art/Flex</Typography>
                </Grid>
            </Grid>
            <Body container justify='center'>
                <SignInBody xs={8} item container direction='column' justify='center' alignItems='center' spacing={3}>
                    <Grid item style={{ 'margin-top': '20px' }}>
                        <Form size='large' variant='outlined' label='Email/Username'
                            onChange={event => setUsername(event.target.value)} />
                    </Grid>
                    <Grid item>
                        <Form variant='outlined' label='Password' onChange={event => setPassword(event.target.value)} />
                        <StyledLink variant='p'>Forgot your password?</StyledLink>
                    </Grid>
                    <Grid style={{ 'margin-top': '50px' }} item>
                        <StyledSignInButton><Typography variant='body1' style={{ 'color': 'white' }}>Sign in</Typography></StyledSignInButton>
                    </Grid>
                </SignInBody>
                <StyledBackButtonContainer item xs={8}>
                    <StyledBackButton onClick={() => props.setPageNumber(0)}><StyledBackArrow />All sign in options</StyledBackButton>
                </StyledBackButtonContainer>
            </Body>
            <Footer>
            </Footer>
        </Container>
    );
}