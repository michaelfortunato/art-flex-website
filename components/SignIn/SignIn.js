import React, { useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import { ClickAwayListener } from '@material-ui/core';
import styled from 'styled-components'
import SignInPane from '@components/SignIn/SignInPane';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography'
import { CSSTransition } from 'react-transition-group'
import styles from '@styles/SignIn.module.css'


export default function SignIn() {
    const [open, setOpen] = useState(false);
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const ref = React.createRef();

    // I think use backdrop fucks up the media query. It a hard corner case to reproduce but there is a flash
    // 1. open ws on full screen
    // 2. minimize to small size < md. 
    // 3. Open sign in 
    // 4. clos sign in, you should see a flicker. moving useMediaQuery up to the parent component of backdrop fixes it. 
    const mddown = useMediaQuery(theme => theme.breakpoints.down("md"));
    return (
        <React.Fragment>
            <Button className={styles.SignInButton} onClick={() => setOpen(true)}>
                <Typography>Sign in</Typography>
            </Button>
            <Backdrop transitionDuration={500} open={open} style={{ 'zIndex': 1 }}>
                <CSSTransition
                    classNames='ani'
                    timeout={500}
                    in={open}
                    unmountOnExit
                >
                    <ClickAwayListener onClickAway={() => setOpen(!open)}>
                        <SignInPane ref={ref} setOpen={setOpen} mddown={mddown} />
                    </ClickAwayListener>
                </CSSTransition>
            </Backdrop>
        </React.Fragment>
    )
}

