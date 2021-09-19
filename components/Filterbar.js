import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import { StylesProvider, Typography } from '@material-ui/core'
import styles from '@styles/Filterbar.module.css'
/*
Person {
    Art : [Art]
    Name : String
    Email : String
    Password :  String
    Address
}

Art {
    Img: Img
    Price: Number 
    Genre: [Genre]
    Size: [Size]
}
*/

// This is gender
const prices = [
    {
        "label": 'Male', 
        "value": 'Male'
    },
    {
        "label": 'Female', 
        "value": 'Female'
    }, 
    {
        "label": 'All', 
        "value": null
    }
]

// This is status
const sizes = [
    {
        "label": 'Alive', 
        "value": 'Alive'
    }, 
    {
        "label": 'Dead', 
        "value": 'Dead'
    }, 
    {
        "label": 'All',
        "value": null
    }
]

const genres = [
    {
        'label' : 'Rick Sanchez', 
        'value': 'Rick Sanchez'
    }, 
    {
        'label': 'All', 
        'value': null
    }
]



export default function Filterbar(props) {
    return (
    <div className = {styles.Filterbar}> 
        <TextField
          select
          label="Select"
          value={props.priceFilter}
          onChange={(event) => props.setPriceFilter(event.target.value)}
          helperText="Select a price"
          variant="outlined"
        >
          {prices.map(({label, value}) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))
          }
          </TextField>
        <TextField
          select
          label="Select"
          value={props.sizeFilter}
          onChange={(event) => props.setSizeFilter(event.target.value)}
          helperText="Select a price"
          variant="outlined"
        >
          {sizes.map(({label, value}) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))
          }
        </TextField>
        <TextField
          select
          label="Select"
          value={props.genreFilter}
          onChange={(event) => props.setGenreFilter(event.target.value)}
          helperText="Select a price"
          variant="outlined"
        >
          {genres.map(({label, value}) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))
          }
        </TextField>
    </div>
    )
}
