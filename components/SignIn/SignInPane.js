import React, { useEffect, useState, useRef } from 'react'
import { Grid, Paper } from '@material-ui/core'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import SignInHome from '@components/SignIn/SignInHome';
import EmailSignIn from '@components/SignIn/SignInEmail'
import SignUp from '@components/SignIn/SignUp'
import { AnimatePresence, motion } from 'framer-motion';
import SuccessfulSignUp from '@components/Welcome/SuccessfulSignUp';
const WrappedPaper = ({ mdDown, ...props }) => (<Paper {...props} />)

const Pane = styled(Paper)`
    width: ${(props) => props.mddown ? '900px' : '900px'};
    height: 900px; 
    padding-top:0px;
    overflow-x: hidden;
    overflow-y: hidden;
    aspect-ratio: 1/1;

    position: relative;
    z-index: 30;
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
    position: absolute;

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

const SignInPane = React.forwardRef((props, ref) => {
    const [pageNumber, setPageNumber] = useState(0);
    const prevPageNumberRef = useRef(0);

    useEffect(() => {
        prevPageNumberRef.current = pageNumber
    }, [pageNumber]);

    const prevPageNumber = prevPageNumberRef.current;
    return (
        <Pane ref={ref} mdDown={props.mddown}>
            {pages.map(({ number, pageName, Component }) => (
                <CSSTransition
                    classNames='ani'
                    timeout={500}
                    in={number === pageNumber}
                    key={number}
                    unmountOnExit
                >
                    <AnimatedContainer forward={pageNumber > prevPageNumber ? true : false}>
                        <Component setOpen={props.setOpen} pageNumber={pageNumber} setPageNumber={setPageNumber} />
                    </AnimatedContainer>
                </CSSTransition>
            ))}
        </Pane>
    )
}
);
export default SignInPane;

