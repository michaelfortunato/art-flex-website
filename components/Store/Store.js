import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'
import Filter from '@components/Filterbar'
import StoreBody from './StoreBody'
import Divider from '@material-ui/core/Divider'

let counter = 0;
export default function Store() {
    const [priceFilter, setPriceFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const filter = {
            "fil": {
                "gender": priceFilter,
                "status": sizeFilter,
                "name": genreFilter
            }
        };

    return (
        <Grid container spacing={8}>
            <Grid item xs = {12}>
            <Filter priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                sizeFilter={sizeFilter}
                setSizeFilter={setSizeFilter}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
            />
            </Grid>
            <Grid item xs = {12}>
            <Divider />
            </Grid>
            <StoreBody variables={filter} />
        </Grid>
    );
}
