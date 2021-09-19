import React from 'react'
import styles from '@styles/Appbar.module.css'
import { Grid, Hidden, Typography} from '@material-ui/core';
import Searchbar from '@components/Searchbar'
import Navigation from '@components/Navigation'

export default function Appbar() {
    return (
        <div className = {styles.Appbar}>
            <Grid container justifyContent = 'center'alignItems = 'center' spacing = {0}>
                <Grid item xs md = {2}>
                    <div className = {styles.logo}>
                        <Typography variant='h1'>AF</Typography>
                    </div>
                </Grid>
                <Hidden smDown>
                <Grid item md = {8}> 
                    <Searchbar />
                </Grid>
                </Hidden>
                <Grid item xs md = {2}> 
                    <Navigation /> 
                </Grid>
            </Grid>
        </div>
    )
}
