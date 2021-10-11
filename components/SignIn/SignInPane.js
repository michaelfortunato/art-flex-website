import React, { useEffect, useState, useRef, forwardRef } from 'react'
import Link from 'next/link'
import {
    Grid,
    Paper,
    Typography,
    useTheme,
} from '@material-ui/core'
import { StandardForm, PasswordForm } from '@components/Library'
import { SignUpNew } from '@components/SignIn/SignUp'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import SignInHome from '@components/SignIn/SignInHome';
import EmailSignIn from '@components/SignIn/SignInEmail'
import SignUp from '@components/SignIn/SignUp'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import SuccessfulSignUp from '@components/Welcome/SuccessfulSignUp';
import GoogleSignInButton from '@components/Buttons/GoogleSignInButton'
import FacebookSignInButton from '@components/Buttons/FacebookSignInButton'
import { SocialBanner } from './SignUp'
import axios from 'axios'
import { signIn } from 'redux-store/features/account/accountSlice'
import { useDispatch } from 'react-redux'
import { StandardButton } from '@components/Buttons/SignInButton'

const WrappedPaper = ({ mdDown, ...props }) => (<Paper {...props} />)

const Pane = styled(motion(Paper))`
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
const GridRow = styled(Grid)` 
    margin-top: 30px; 
    overflow: `

const StyledSignUp = (props) => {
    const [successfulSignUp, setSuccessfulSignUp] = useState(false)
    return <Grid container justifyContent='center' alignItems='center' style={{ height: '100%' }}>
        <Grid item>
            <AnimatePresence exitBeforeEnter>
                {!successfulSignUp ?
                    <motion.div exit={{ opacity: 0 }}>
                        <SignUpNew setPage={props.setPage} />
                    </motion.div>
                    : <SuccessfulSignUp small onAnimationComplete={() => setTimeout(() => props.setOpen(false), 800)} />}
            </AnimatePresence>
        </Grid>
    </Grid>
}

const SignInForm = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpFailed, setSignUpFailed] = useState({ status: false, message: null })
    const theme = useTheme();
    const dispatch = useDispatch()

    const signInSuccess = (res) => {
        const { data: { name, email } } = res
        dispatch(signIn({ name, email }))
    }
    const signInFailure = (error) => {
        console.log(error)
        if (error.response) {
            setSignUpFailed({ status: true, message: error.response.data.statusMessage })
        } else {
            setSignUpFailed({ status: true, message: "Internal server error" })
        }
    }



    useEffect(() => {
        setSignUpFailed({ status: false, message: null })
    }, [email, password])

    return (<Grid container style={{ minWidth: 324, padding: 6 }} direction="row">
        <Grid container item xs={12} alignItems='center'>
            <Grid item xs={6}>
                <Typography variant='h5'>Sign in</Typography>
            </Grid>
            <Grid item container xs={6} direction='row-reverse'>
                <Grid item xs='auto'>
                    <StandardButton
                        animateTo={{
                            boxShadow: '0 4px 20px rgb(34 34 34 / 15%)',
                            scale: 1.02
                        }}
                        animate={true}
                        styleOverrides={
                            {
                                padding: 8,
                                paddingLeft: 18,
                                paddingRight: 18,
                            }}
                        onClick={() => props.setPage('SignUp')}
                    >
                        <Typography variant='body1'>Register</Typography>
                    </StandardButton>
                </Grid>
            </Grid>
        </Grid>
        <GridRow item xs={12}>
            <StandardForm type='email' text='Email address' onChange={(event) => setEmail(event.target.value)} />
        </GridRow>
        <GridRow item xs={12}>
            <PasswordForm type='password' text='Password' setPassword={setPassword} />
        </GridRow>
        {signUpFailed.status && (
            <Grid item xs={12} >
                <Typography
                    style={{ color: theme.palette.error.main }}
                    variant="body1"
                >
                    {signUpFailed.message}
                </Typography>
            </Grid>
        )}
        <GridRow style={{ textAlign: 'center' }} item xs={12}>
            <Typography variant='body1'>
                <Link href='/forgot_password'><a style={{ color: 'black' }}>Forgot your password?</a></Link>
            </Typography>
        </GridRow>
        <GridRow item xs={12}
        >
            <StandardButton
                animate
                styleOverrides={{ width: '100%', textAlign: 'center', borderStyle: 'none', backgroundColor: theme.palette.primary.main }}
                onClick={async () => axios.post('/login', { email, password })
                    .then(signInSuccess)
                    .catch(signInFailure)}>
                <Typography style={{ color: 'white', textTransform: 'none' }} variant='button'>
                    Sign in
                </Typography>
            </StandardButton>
        </GridRow>

        <Grid style={{ marginTop: 20 }} item xs={12} >
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
    </Grid>
    )
}

const pages = [SignInForm, StyledSignUp]

const SignInPane = forwardRef((props, ref) => {
    const [page, setPage] = useState('SignIn');
    return (
        <AnimateSharedLayout>
            <Pane layout ref={ref} >
                <div style={{ maxWidth: 324 }}>
                    <AnimatePresence exitBeforeEnter initial={false}>
                        {page === 'SignIn' ?
                            <motion.div key='SignIn' initial={{ x: '-150%' }} animate={{ x: 0}} >
                                <SignInForm setPage={setPage} />
                            </motion.div>
                            :
                            <motion.div key='SignUp' initial={{ x: '150%' }} animate={{ x: 0 }} >
                                <StyledSignUp setPage={setPage} />
                            </motion.div>
                        }
                    </AnimatePresence>
                    <motion.div layout style={{ marginTop: 20 }}>
                        <Typography style={{ color: 'black', opacity: .8 }} variant='body2'>
                            By clicking Sign in, you agree to Art Flex's
                            <Link href='/legal/term_of_use'><a style={{ color: 'inherit' }}> Terms of Use</a></Link> and
                            <Link href='/legal/privacy_policy'><a style={{ color: 'inherit' }}> Privacy Policy</a></Link>.
                            You may change your preferences in your account settings at any time. We will never post
                            or share your information without your explicit permission.
                        </Typography>
                    </motion.div>
                </div>
            </Pane >
        </AnimateSharedLayout>
    )
})
export default SignInPane;
