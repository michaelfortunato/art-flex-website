import React from 'react'
import styles from '@styles/StoreTile.module.css'
import styled, { useTheme } from 'styled-components'
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
const Tag = styled.span`
    display: inline-block;
    margin: 4px;
    margin-left: ${props => props.index === 0 ? 0 : 4}px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 20px;
    opacity: .8;
    background-color: ${(props) => props.theme.tag[props.variant].backgroundColor};
    color: ${(props) => props.theme.tag[props.variant].textColor};
`
const imageBaseURL = "https://www.artic.edu/iiif/2"
export default function StoreTile(props) {
    return (
        <StyledTile square elevation={4}>
            <div>
                <div style={{ textAlign: "center" }}>
                    <Image
                        width={props.image_size.width}
                        height={props.image_size.height}
                        src={`${imageBaseURL}/${props.image_url}/full/843,/0/default.jpg`} />
                </div>

                <div style={{ maxWidth: props.image_size.width + 50 }}>
                    <Divider style={{ height: 1, marginTop: 10, marginBottom: 10 }} />
                    <div>
                        <Typography variant='h5'>
                            {props.artist_name}
                        </Typography>
                    </div>
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        <Typography variant="body1">
                            {props.description}
                        </Typography>
                    </div>
                </div>
                <div style={{ maxWidth: props.image_size.width + 75, marginTop: '10px' }}>
                    {props.tags.map((tag, index) => {
                        return <Tag key = {index} index={index} variant={{
                            0: "period",
                            1: "social",
                            2: "prominence",
                            3: "prominence",
                        }[index] || "period"
                        }>{tag}</Tag>
                    })}
                </div>
                <div style={{ maxWidth: props.image_size.width + 75, marginTop: '10px' }}>
                    <Typography variant='subtitle1'>
                        <i>
                            {props.artwork_name}
                        </i>
                    </Typography>
                </div>
                <div style={{ maxWidth: props.image_size.width + 75, marginTop: '10px' }}>
                    {props.rental_pricing.map(({ price, period }, index) => {
                        return <Button key = {index} style={{ marginRight: 10, marginBottom: 10 }}
                            variant="contained" color="secondary">
                            {`Rent for $${price} per ${period}`}</Button>
                    })}
                    <Button style={{ marginRight: 10, marginBottom: 10 }}
                        variant="contained" color="primary">
                        {`Buy for $${props.buy_price}`}</Button>
                </div>
            </div>
        </StyledTile>
    )
}
