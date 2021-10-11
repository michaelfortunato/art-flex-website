import React from 'react'
import { Button, Grid, IconButton, StylesProvider } from '@material-ui/core'
import SignIn from '@components/SignIn/SignIn'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

export default function Navigation() {
    return (
        <Grid container justifyContent='space-evenly'>
            <Grid item xs='auto'>
                <SignIn />
            </Grid>
            <Grid item xs='auto'>
                <IconButton color='inherit'>
                    <ShoppingCartOutlinedIcon fontSize='large' />
                </IconButton>
            </Grid>
        </Grid>
    )
}
