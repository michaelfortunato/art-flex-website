import { useState, useRef, forwardRef } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import { ClickAwayListener } from '@material-ui/core';
import SignInPane from '@components/SignIn/SignInPane';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const StyledButton = styled(Button)`
    border-radius: 25px;
    margin: 10px;
    text-transform: none;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
`


export default function SignIn() {
    const [open, setOpen] = useState(false);
    const [animationInProgress, setAnimationInProgress] = useState(false);
    const [animationClass, setAnimationClass] = useState('');

    // I think use backdrop fucks up the media query. It a hard corner case to reproduce but there is a flash
    // 1. open ws on full screen
    // 2. minimize to small size < md. 
    // 3. Open sign in 
    // 4. clos sign in, you should see a flicker. moving useMediaQuery up to the parent component of backdrop fixes it. 
    const mddown = useMediaQuery(theme => theme.breakpoints.down("md"));
    return (
        <>
            <StyledButton onClick={() => setOpen(true)}>
                <Typography>Sign in</Typography>
            </StyledButton>
            <Backdrop open={open} style={{ zIndex: 1, padding: 12 }}>
                {open && <ClickAwayListener onClickAway={() => setOpen(false)} children={<SignInPane />} />}
            </Backdrop>
        </>
    )
}

