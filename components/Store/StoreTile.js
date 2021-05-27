import React from 'react'
import styles from '@styles/StoreTile.module.css'
import {Paper, Grid, Button, Typography} from '@material-ui/core'


export default function StoreTile(props) {
    return (
        <Paper square elevation = {2} className = {styles.Paper}>
            <img src={props.imgURL} />
            <div>
                <Typography variant='h5'>
                    {props.name}     
                </Typography>
            </div>
        </Paper>
    )
}
