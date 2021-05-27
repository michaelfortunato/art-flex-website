import React, { useEffect, useState, useRef } from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import { Typography } from '@material-ui/core';
import { CSSTransition } from 'react-transition-group'
import SignInHome from '@components/SignIn/SignInHome';
import EmailSignIn from '@components/SignIn/SignInEmail'
import SignUp from '@components/SignIn/SignUp'
const WrappedPaper = ({ mdDown, ...props }) => (<Paper {...props} />)

const Pane = styled(Paper)`
    width: ${(props) => props.mdDown ? '900px' : '900px'};
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
        Component: SignUp
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
                        <Component pageNumber={pageNumber} setPageNumber={setPageNumber} />
                    </AnimatedContainer>
                </CSSTransition>
            ))}
        </Pane>
    )
}
);
export default SignInPane;

