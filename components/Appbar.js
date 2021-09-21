import React, { useState, useRef } from 'react'
import styles from '@styles/Appbar.module.css'
import { Divider, Grid, Hidden, Menu, Popper, Typography } from '@material-ui/core';
import Searchbar from '@components/Searchbar'
import Navigation from '@components/Navigation'
import styled from 'styled-components'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
const pages = [
    {
        url: "/art",
        name: "Art"
    }, {
        url: "/about",
        name: "About"
    },
    {
        url: "/about",
        name: "About"
    }
]
const StyledMenubar = styled(Grid)`
    margin-top:-10px;
`
export default function Appbar(props) {
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [underlinePos, setUnderlinePos] = useState({
        left: 0,
        width: 0
    })
    const underlineRef = useRef(null);
    const underlineTimer = useRef(null);
    const greybarRef = useRef(null);
    const onMouseEnter = (event) => {

        clearTimeout(underlineTimer.current);
        const textPos = event.target.getBoundingClientRect()
        setUnderlinePos({
            left: textPos.x - greybarRef.current.getBoundingClientRect().x,
            width: textPos.width
        })
        setIsUnderlined(true)
        /*
        if (isUnderlined === false) {
            prevIsUnderlined(false)
        }
        setIsUnderlined(true);
        */
    }
    const onMouseOut = () => {
        
        clearTimeout(underlineTimer.current)
        underlineTimer.current = setTimeout(() => 
        setIsUnderlined(false), 1000)
    }

    return (
        <div ref={props.appbarRef} className={styles.Appbar}>
            <Grid container justifyContent='center' alignItems='center' spacing={0}>
                <Grid item md={2}>
                    <div className={styles.logo}>
                        <Typography variant='h1'>AF</Typography>
                    </div>
                </Grid>
                <Hidden smDown>
                    <Grid item md={8}>
                        <Searchbar />
                    </Grid>
                </Hidden>
                <Grid item md={2}>
                    <Navigation />
                </Grid>
                <StyledMenubar container item xs={12} md={8} justifyContent="space-evenly">
                    {pages.map(({ url, name }, index) =>
                        <Grid key={index} item onMouseOut={onMouseOut} onMouseOver={onMouseEnter}>
                            <Link href={url}>
                                <Typography variant="button">
                                    <a>
                                        {name}
                                    </a>
                                </Typography>
                            </Link>
                        </Grid>
                    )}
                </StyledMenubar>
                <Grid ref={greybarRef} item xs={12} style={{ marginTop: 15, height: 3, backgroundColor: "#dedede" }}>
                    <div style={{ position: 'relative', height: "100%" }}>
                        <AnimatePresence>
                            {isUnderlined &&
                                <motion.span
                                    exit={{ scaleX: 0, transformOrigin: "50% 50%" }}
                                    initial={{ width: 0 }}
                                    animate={{ width: underlinePos.width, left: underlinePos.left }}
                                    style={{
                                        transformOrigin: "50% 50%",
                                        scaleX: 1.1,
                                        position: "absolute",
                                        display: "inline-block",
                                        left: underlinePos.left,
                                        height: "100%",
                                        width: underlinePos.width,
                                        backgroundColor: "black"
                                    }} />}
                        </AnimatePresence>
                        <span
                            style={{
                                position: "absolute",
                                display: "inline-block",
                                left: underlinePos.left,
                                width: underlinePos.width,
                            }}
                            ref={underlineRef}
                        />
                        <Popper
                            anchorEl={underlineRef.current}
                            open={underlineRef.current !== null}
                            placement='bottom'
                        >
                            jfklsaj;falksj;fdlskaj;lfa
                        </Popper>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
