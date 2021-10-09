import React, { useEffect, useState, useRef, forwardRef } from 'react'
import Link from 'next/link'
import { Grid, Paper, Typography, TextField, useTheme } from '@material-ui/core'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import SignInHome from '@components/SignIn/SignInHome';
import EmailSignIn from '@components/SignIn/SignInEmail'
import SignUp from '@components/SignIn/SignUp'
import { AnimatePresence, motion } from 'framer-motion';
import SuccessfulSignUp from '@components/Welcome/SuccessfulSignUp';
import GoogleSignInButton from '@components/Buttons/GoogleSignInButton'
import FacebookSignInButton from '@components/Buttons/FacebookSignInButton'
import { SocialBanner } from './SignUp'

const WrappedPaper = ({ mdDown, ...props }) => (<Paper {...props} />)

const Pane = styled(Paper)`
    padding:30px;
    overflow-x: hidden;
    overflow-y: hidden;
    display: inline;
    border-radius: 24px;
    position: relative;
    width: 100%
    z-index: 2;
    &.ani-enter {
        opacity: 0;
        transform: translateY(-20px);
    }
    &.ani-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: all 500ms;
    } 
    &.ani-exit {
        opacity: 1;
        transform: translateY(0px);
    }
    &.ani-exit-active {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 500ms;
    } 

`
const AnimatedContainer = styled.div`
    width: 100%;
    height: 100%;

    &.ani-enter {
        opacity: 0;
        transform: ${props => props.forward ? `translateX(100%)` : `translateX(-100%)`};
    }
    &.ani-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: all 500ms;
    }
    &.ani-enter-done {
        opacity: 1;
        transform: translateX(0);
    }  

    &.ani-exit {
        opacity: 1;
        transform: translateX(0);
    }
    &.ani-exit-active {
        opacity: 0;
        transform: ${props => props.forward ? `translateX(-100%)` : `translateX(100%)`};
        transition: all 500ms;
    } 
    &.ani-exit-done {
        opacity: 0; 
        transform: ${props => props.forward ? `translateX(-100%)` : `translateX(100%)`};
    }
 `

const StyledSignUp = (props) => {
    const [successfulSignUp, setSuccessfulSignUp] = useState(false)
    return <Grid container justifyContent='center' alignItems='center' style={{ height: '100%' }}>
        <Grid item>
            <AnimatePresence exitBeforeEnter>
                {!successfulSignUp ?
                    <motion.div exit={{ opacity: 0 }}>
                        <SignUp signUpCallback={() => setSuccessfulSignUp(true)} {...props} />
                    </motion.div>
                    : <SuccessfulSignUp small onAnimationComplete={() => setTimeout(() => props.setOpen(false), 800)} />}
            </AnimatePresence>
        </Grid>
    </Grid>
}
const pages = [
    {
        number: 0,
        pageName: "SignInHome",
        Component: SignInHome
    }, {
        number: 1,
        pageName: "SignInEmail",
        Component: EmailSignIn
    }, {
        number: 2,
        pageName: "SignUp",
        Component: StyledSignUp
    }
]


const GridRow = styled(Grid)`
    margin-top: 30px;
`

const SocialButton = styled.div`
    border-radius: 24px;
    border-color: black;
    border-width: 2px;
    border-style: solid;
`

const SignInPane = forwardRef((props, ref) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const prevPageNumberRef = useRef(0);

    const theme = useTheme();
    useEffect(() => {
        prevPageNumberRef.current = pageNumber
    }, [pageNumber]);

    const prevPageNumber = prevPageNumberRef.current;
    return (
        <Pane ref={ref} >
            <Grid container style={{ maxWidth: 384 }} direction="column">
                <Grid container item xs={12}>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Sign in</Typography>
                    </Grid>
                    <Grid item container xs={6} direction='row-reverse'>
                        <Grid item>
                            <Typography variant='h5'>Register</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <GridRow item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        InputProps={{ spellCheck: false }}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </GridRow>
                <GridRow item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        InputProps={{ spellCheck: false }}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </GridRow>
                <GridRow style={{ textAlign: 'center' }} item xs={12}>
                    <Typography variant='body1'>
                        <Link href='/forgot_password'><a style={{ color: 'black' }}>Forgot your password?</a></Link>
                    </Typography>
                </GridRow>
                <GridRow style={{ padding: 10, textAlign: 'center', borderRadius: '24px', backgroundColor: theme.palette.primary.main }} item xs={12}>
                    <Typography style={{ color: 'white' }} variant='body1'>
                        Sign in
                    </Typography>
                </GridRow>
                <GridRow item xs={12}>
                    <SocialBanner />
                </GridRow>
                <GridRow item xs={12}>
                    <GoogleSignInButton />
                </GridRow>
                <Grid style={{ marginTop: 12 }} item xs={12}>
                    <FacebookSignInButton />
                </Grid>
                <Typography style={{ marginTop: 12, display: 'block' }} variant='body2'>
                    Messages about Artflex ...
                </Typography>
            </Grid>
        </Pane >
    )
})
export default SignInPane;
