import React, { useState, useContext } from 'react'
import styled from 'styled-components';
import { useTheme } from '@material-ui/core/styles'
import { ButtonBase, Grid, TextField, Typography, Link, Divider } from '@material-ui/core'
import { ArrowBackIosOutlined } from '@material-ui/icons'
import styles from '@styles/SignUp.module.css'
const Container = styled.div`
    margin-left: 10%;
    margin-right: 10%;
    height: 100%;
`
const Body = styled(Grid)`
    margin-top: 30px;
`

const SignInBody = styled(Grid)`
    border-radius: 6px;
    border: 1px solid #eaecef;
    background-color: #f6f8fa; 
    height: 100%;
    width: 100%;
    padding: 20px;
    padding-top: 10px;
`

const StyledButton = styled(ButtonBase)`
    && {
        padding: 20px;
        width: 100%; 
        height: 56px;
        border-radius: 6px;
        background-color: #3b537a;
    }
`

const StyledLink = styled(Link)`
    padding-top: 10px;
    &:hover{
        cursor: pointer;
    }
`

const Form = styled(TextField)`
    && {
    }
    `

const StyledBackButtonContainer = styled(Grid)`
    text-align: center; 
    padding-top: 60px;
    display: inline-block;
`
const Footer = styled(Grid)`
    text-align: center;
`
const StyledLogo = styled.img`
    height: 175px;
    padding: 0;
    margin: 0;
`
const StyledDivider = styled(Divider)`
    && {
        margin-top: -40px;
    }
`
const FieldContainer = styled(Grid)`
    text-align: center;
`

const StyledRoleButton = styled(Grid)`
        height: 40px;
        text-align: center;
        border: 1px solid black;
        border-radius: 6px;
`
export default function SignUp(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    const theme = useTheme();
    return (
        <div className = {styles.container}>
            <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
                <Grid item>
                    <img className = {styles.logo} src={'MainLogo.svg'} />
                </Grid>
            </Grid>
            <Divider className = {styles.divider} />

            <Grid className={styles.body} container justify='center'>
                <Grid className={styles.sign_up_body} xs={9} item container justify='center' alignItems='center' spacing={3}>
                    <Grid item xs={12}>
                        <Typography style={{ 'margin-top': '-5px', 'color': 'black' }} variant='h4'>Create account</Typography>
                    </Grid>
                    <Grid className = {styles.field_container} item xs={12} style={{ 'margin-top': '0px' }}>
                        <Form fullWidth size='large' variant='outlined' label='Name'
                            onChange={event => ""} />
                    </Grid>
                    <Grid className ={styles.field_container} item xs={12} >
                        <Form fullWidth size='large' variant='outlined' label='Email'
                            onChange={event => ""} />
                    </Grid>
                    <Grid className = {styles.field_container} item xs={12}>
                        <Form fullWidth variant='outlined' label='Password' onChange={event => setPassword(event.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <Form fullWidth variant='outlined' label='Confirm Password' onChange={event => setPassword(event.target.value)} />
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='body1'>Please select your role(s)</Typography>
                        </Grid>
                        <Grid className={styles.role_button} item xs={6}>I am an artist</Grid>
                        <Grid className={styles.role_button} item xs={6}>I am a buyer</Grid>
                    </Grid>
                    <Grid style={{ 'margin-top': '10px' }} item xs={12}>
                        <ButtonBase className={styles.create_account_button}><Typography variant='body1' style={{ 'color': 'white' }}>Finalize your sign up</Typography></ButtonBase>
                    </Grid>
                </Grid>
                <Grid className ={styles.back_button_container} item xs={8}>
                    <Typography style={{ 'display': 'inline' }}>Already have an account? </Typography><Link className={styles.link} onClick={() => props.setPageNumber(0)}>Sign in</Link>
                </Grid>
            </Grid>
            <Footer>
            </Footer>
        </div>
    );
}