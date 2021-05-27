import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import SignIn from '@components/SignIn/SignIn';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { ButtonBase, Grid, Link, Typography } from '@material-ui/core';
import GoogleSignIn from '@components/Buttons/GoogleSignInButton'
import EmailSignInButton from '@components/Buttons/EmailSignInButton';

const WrappedPaper = ({ mdDown, ...props }) => (<Paper {...props} />)



const Container = styled.div`
    margin-top: 100px;
    margin-left: 10%;
    margin-right: 10%;
`

const StyledHeader = styled(Typography)`
    text-align: center;
`

const StyledContainer = styled.div`
    margin-top: 30px;
    margin-left: 10%;
    margin-right: 10%;
`

const StyledButtons = styled.div`
    margin-top: 15%;
    text-align: center;
`
const ButtonWrapper = styled.div`
   display: inline-block;
`
const StyledFooter = styled.div`
    margin-top: 30%;
    text-align: center;
`
const StyledTypography = styled(Typography)`
    display: inline;
`
const StyledLink = styled(Typography)`
    ${({ theme }) => `
        && {
            color: ${theme.palette.primary.main};
            font-weight: bold;
            display: inline;
            &:hover {
                cursor: pointer;
            }
        }
        `
    }
`
const Buttons = [<GoogleSignIn />, <EmailSignInButton />]

export default function SignInHome(props) {
    return (
        <Container>
            <Grid container justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <StyledHeader variant='h4'>Welcome back.</StyledHeader>
                </Grid>
            </Grid>
            <StyledButtons>
                <Grid container direction='row' justify='center' alignItems='center' spacing={1}>
                    <Grid item xs={9}> <GoogleSignIn /> </Grid>
                    <Grid item xs={9}> <EmailSignInButton setPageNumber={props.setPageNumber} setForward={props.setForward} /> </Grid>
                </Grid>
            </StyledButtons>
            <StyledFooter>
                <StyledTypography style = {{'display':'inline'}} variant = 'h6'>Don't have an account? </StyledTypography>
                <StyledLink onClick = {() => props.setPageNumber(2)} variant = 'h6'>Create one</StyledLink>
            </StyledFooter>
        </Container>
    )
}

