import React, { useEffect, useState, useRef, forwardRef } from 'react'
import Link from 'next/link'
import {
    Grid,
    Paper,
    Typography,
    TextField,
    useTheme,
    FormControl,
    InputLabel,
    Input
} from '@material-ui/core'
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
    padding: 30px;
    overflow-x: hidden;
    overflow-y: hidden;
    display: inline;
    border-radius: 24px;
    position: relative;
    width: 100%:
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
    overflow: 
`

const SocialButton = styled.div`
    border-radius: 24px;
    border-color: black;
    border-width: 2px;
    border-style: solid;
`
const StyledInput = styled.input
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
            <Grid container style={{ maxWidth: 324, padding: 6 }} direction="row">
                <Grid container item xs={12} alignItems='center'>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Sign in</Typography>
                    </Grid>
                    <Grid item container xs={6} direction='row-reverse'>
                        <Grid item xs='auto'>
                            <div style={{ borderStyle: 'solid', borderWidth: 2, borderRadius: 24, padding: 8, paddingLeft: 18, paddingRight: 18 }}>
                                <Typography variant='body1'>Register</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <GridRow item xs={12}>
                    <div style={{ paddingLeft: 2 }}><Typography><b>Email address</b></Typography></div>
                    <StyledInput />
                </GridRow>
                <GridRow item xs={12}>
                    <div style={{ paddingLeft: 2 }}><Typography><b>Password</b></Typography></div>
                    <StyledInput/>
                </GridRow>
                <GridRow style={{ textAlign: 'center' }} item xs={12}>
                    <Typography variant='body1'>
                        <Link href='/forgot_password'><a style={{ color: 'black' }}>Forgot your password?</a></Link>
                    </Typography>
                </GridRow>
                <GridRow style={{ padding: 10, textAlign: 'center', borderRadius: '24px', backgroundColor: theme.palette.primary.main }} item xs={12}>
                    <Typography style={{ color: 'white', textTransform: 'none' }} variant='button'>
                        Sign in
                    </Typography>
                </GridRow>
                <Grid style={{marginTop: 20}} item xs={12} >
                    <div style={{ marginLeft: -36, marginRight: -36 }}>
                        <SocialBanner fontSize='1rem' />
                    </div>
                </Grid>
                <Grid style={{ marginTop: 12 }} item xs={12}>
                    <GoogleSignInButton />
                </Grid>
                <Grid style={{ marginTop: 12 }} item xs={12}>
                    <FacebookSignInButton />
                </Grid>
                <div style={{ marginTop: 20 }}>
                    <Typography style = {{color:'black', opacity:.8}} variant='body2'>
                        By clicking Sign in, you agree to Art Flex's
                        <Link href='/legal/term_of_use'><a style={{color:'inherit'}}> Terms of Use</a></Link> and 
                        <Link href='/legal/privacy_policy'><a style={{color:'inherit'}}> Privacy Policy</a></Link>.
                        You may change your preferences in your account settings at any time. We will never post or share your information without your permission.
                    </Typography>
                </div>
            </Grid>
        </Pane >
    )
})
export default SignInPane;
