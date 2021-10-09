import React, { useEffect, useState, useRef, forwardRef } from 'react'
import Link from 'next/link'
import {
    Grid,
    Paper,
    Typography,
    useTheme,
    InputBase,
    InputAdornment,
    IconButton,
} from '@material-ui/core'
import {
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";
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
import axios from 'axios'
import { signIn } from 'redux-store/features/account/accountSlice'
import { useDispatch } from 'react-redux'

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
const StyledInput = styled(InputBase)
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

/*
    Material ui styles.
`
    color: rgba(0, 0, 0, 0.87);
    cursor: text;
    display: inline-flex;
    position: relative;
    font-size: 1rem;
    box-sizing: border-box;
    align-items: center;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
    letter-spacing: 0.00938em;

`
*/
const PasswordField = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <StyledInput
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
    );
};

const SignInForm = (props) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [signUpFailed, setSignUpFailed] = useState({ status: false, message: null })
    const theme = useTheme();
    const dispatch = useDispatch()

    useEffect(() => {
        setSignUpFailed({ status: false, message: null })
    }, [email, password])
    const SignInUser = async (props) => {
        try {
            console.log(email)
            const { data: { name, email: normalizedEmail } } = await axios.post('/login', { "email": email, "password": password })
            dispatch(signIn({ name, email: normalizedEmail }))
        } catch (error) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // or something happened in setting up the request that triggered an Error
            if (error.response) {
                setSignUpFailed({ status: true, message: error.response.data.statusMessage })
            } else {
                setSignUpFailed({ status: true, message: "Internal server error" })
            }
        }
    }


    return (<Grid container style={{ maxWidth: 324, padding: 6 }} direction="row">
        <Grid container item xs={12} alignItems='center'>
            <Grid item xs={6}>
                <Typography variant='h5'>Sign in</Typography>
            </Grid>
            <Grid item container xs={6} direction='row-reverse'>
                <Grid item xs='auto'>
                    <motion.button 
                    whileHover ={{
                    boxShadow: '0 4px 20px rgb(34 34 34 / 15%)',
                    scale: 1.01
                    }}
                    style={{
                        cursor: 'pointer', backgroundColor: '#FFFFFF',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 24,
                        padding: 8,
                        paddingLeft: 18, paddingRight: 18
                    }}>
                        <Typography variant='body1'>Register</Typography>
                    </motion.button>
                </Grid>
            </Grid>
        </Grid>
        <GridRow item xs={12}>
            <div style={{ paddingLeft: 2 }}><Typography><b>Email address</b></Typography></div>
            <StyledInput type='email' onChange={event => setEmail(event.target.value)} />
        </GridRow>
        <GridRow item xs={12}>
            <div style={{ paddingLeft: 2 }}><Typography><b>Password</b></Typography></div>
            <PasswordField setPassword={setPassword} />
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
            <motion.button
                whileHover={{
                    scale: 1.05,
                }}
                style={{ width: '100%', cursor: 'pointer', padding: 10, textAlign: 'center', borderRadius: '24px', borderStyle: 'none', backgroundColor: theme.palette.primary.main }}
            >
                <Typography style={{ color: 'white', textTransform: 'none' }} onClick={SignInUser} variant='button'>
                    Sign in
                </Typography>
            </motion.button>
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
        <div style={{ marginTop: 20 }}>
            <Typography style={{ color: 'black', opacity: .8 }} variant='body2'>
                By clicking Sign in, you agree to Art Flex's
                <Link href='/legal/term_of_use'><a style={{ color: 'inherit' }}> Terms of Use</a></Link> and
                <Link href='/legal/privacy_policy'><a style={{ color: 'inherit' }}> Privacy Policy</a></Link>.
                You may change your preferences in your account settings at any time. We will never post 
                or share your information without your explicit permission.
            </Typography>
        </div>
    </Grid>
    )
}

const SignInPane = forwardRef((props, ref) => {
    const [pageNumber, setPageNumber] = useState(0);
    return (
        <Pane ref={ref} >
            <SignInForm />
        </Pane >
    )
})
export default SignInPane;
