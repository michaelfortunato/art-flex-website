import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { useQuery, gql } from '@apollo/client';
import { Typography } from '@material-ui/core';
import StoreTile from './StoreTile'
import styles from '@styles/StoreBody.module.css'
import useSWR from 'swr';
import { ContactSupportOutlined } from '@material-ui/icons';
import axios from 'axios';

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
const API_KEY = "sb70i2aruc7yxu95r05fnpoh"
//https://developers.etsy.com/documentation/reference#operation/findAllListingsActive
const URL = "https://openapi.etsy.com/v3/application/listings/active"
const baseURL = "https://api.artic.edu"
export default function StoreBody(props) {
    const { data, error } = useSWR(`${baseURL}/api/v1/artworks?page=${props.pageNumber}&limit=20`,
        url => fetch(url).then(res => res.json()), res => console.log(res))
    if (error) return <Typography variant="h2">Error</Typography>
    if (!data) return <Typography variant="h2">Loading...</Typography>
    return data.data.map(({ 
         id: art_id, 
         title: art_name,
         artist_id : artist_id,
         artist_title: artist_name, 
         provenance_text: description, 
         style_titles: tags, 
         main_reference_number: price,
         image_id: image_url
        }, index) =>
        <Grid key={art_id} item>
            <StoreTile art_id={art_id}
                art_name={art_name}
                artist_id={artist_id}
                artist_name={artist_name}
                description={description}
                price = {price}
                image_url={image_url}
                image_size = {{
                    width: index%2 === 0 ? 400 : 200,
                    height: index%2 === 0 ? 400 : 200,
                }}
                tags={tags} />
        </Grid>
    )
}
