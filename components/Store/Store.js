import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components'
import Filter from '@components/Filterbar'
import StoreBody from './StoreBody'
import Divider from '@material-ui/core/Divider'
import {useInView} from 'react-intersection-observer';

let counter = 0;
export default function Store() {
    const [pages, setPages] = useState([20])
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
        <div>
            <Grid container spacing={6} justifyContent="center">
                {pages.map((page) => <StoreBody key = {page} pageNumber={page} variables={filter} /> )}
            </Grid>
            <div style = {{opacity:0}} ref ={bottomPageRef}>[Bottom]</div>
        </div>
    );
}
