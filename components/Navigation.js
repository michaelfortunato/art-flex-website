import React from 'react'
import {Button,IconButton, StylesProvider } from '@material-ui/core'
import SignIn from '@components/SignIn/SignIn'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import styles from '@styles/Navigation.module.css'

export default function Navigation() {
    return (
        <div className={styles.nav}>
            <SignIn />
            <IconButton color = 'inherit'>
                <ShoppingCartOutlinedIcon fontSize='large' />
            </IconButton>
        </div>
    )
}
