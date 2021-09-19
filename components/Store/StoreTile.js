import React from 'react'
import styles from '@styles/StoreTile.module.css'
import styled from 'styled-components'
import { Paper, Grid, Button, Typography, Divider } from '@material-ui/core'
import Image from 'next/image';
const StyledTile = styled(Paper)`
    position: relative; 
    padding: 40px;
    border-radius: 10px;
    width: auto;
    height: auto;
    margin: 20;

`

const API_KEY = "sb70i2aruc7yxu95r05fnpoh"
const imageBaseURL = "https://www.artic.edu/iiif/2"
export default function StoreTile(props) {
    return (
        <StyledTile square elevation={4}>
            <div>
                <Image
                    width={props.image_size.width}
                    height={props.image_size.height}
                    src={`${imageBaseURL}/${props.image_url}/full/843,/0/default.jpg`} />
                <Divider style={{ height: 1, marginTop: 10, marginBottom: 10 }} />
                <Typography variant='h5'>
                    {props.artist_name}
                </Typography>
                <div style={{ maxHeight: 200, maxWidth: props.image_size.width, overflowY:'scroll'}}>
                    <Typography variant="body1">
                        {props.description}
                    </Typography>
                </div>
            </div>
        </StyledTile>
    )
}
