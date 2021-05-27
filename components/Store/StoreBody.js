import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { useQuery, gql } from '@apollo/client';
import { Typography } from '@material-ui/core';
import StoreTile from './StoreTile'
import styles from '@styles/StoreBody.module.css'

const QUERY = gql` 
query GetCharacter($fil:FilterCharacter){
    characters(filter: $fil) {
        info {
            pages
        }
        results {
            id
            name
            species
            image
        }
    }
}
`;


export default function StoreBody(props) {
    let { loading, error, data } = useQuery(QUERY, {variables : props.variables});
    let tiles = null
    if (!loading && !error) {
        tiles = data.characters.results.map(({ id, name, image, gender }) =>
            <Grid className = {styles.grid} key={id} item md={4} xs={12} >
                <StoreTile name={name} imgURL={image} gender={gender} />
            </Grid>
        )
    } 
    return (
        <React.Fragment>
            {loading && <Typography variant="h2">Loading...</Typography>}
            {tiles}
        </React.Fragment>
    )
}
