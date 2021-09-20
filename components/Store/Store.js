import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'
import Filter from '@components/Filterbar'
import StoreBody from './StoreBody'
import Divider from '@material-ui/core/Divider'
import {useInView} from 'react-intersection-observer';

let counter = 0;
export default function Store() {
    const [pages, setPages] = useState([0])
    const [priceFilter, setPriceFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const {ref: bottomPageRef, inView: bottomInView}  = useInView();
    console.log(bottomInView)
    useEffect(()=> {
        if (bottomInView) setPages(pages.concat(pages[pages.length-1]+1))
    }, [bottomInView])
    const filter = {
        "fil": {
            "gender": priceFilter,
            "status": sizeFilter,
            "name": genreFilter
        }
    };

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <Filter priceFilter={priceFilter}
                    setPriceFilter={setPriceFilter}
                    sizeFilter={sizeFilter}
                    setSizeFilter={setSizeFilter}
                    genreFilter={genreFilter}
                    setGenreFilter={setGenreFilter}
                />
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item container xs={12} spacing={4} justifyContent="center">
                {pages.map((page) => <StoreBody key = {page} pageNumber={page} variables={filter} /> )}
            </Grid>
            <div ref ={bottomPageRef}>Hello</div>
        </Grid>
    );
}
