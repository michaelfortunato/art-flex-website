import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import StoreTile from "./StoreTile";
import styles from "@styles/StoreBody.module.css";
import useSWR from "swr";
import { ContactSupportOutlined } from "@material-ui/icons";

const baseURL = "https://api.artic.edu";
export default function StoreBody(props) {
  const { data, error } = useSWR(
    `${baseURL}/api/v1/artworks?page=${props.pageNumber}&limit=20`,
    url => fetch(url).then(res => res.json())
  );
  console.log(data);
  if (error) return <Typography variant="h2">Error</Typography>;
  if (!data) return <Typography variant="h2">Loading...</Typography>;
  return data.data.map(
    (
      {
        id: artwork_id,
        title: artwork_name,
        artist_id: artist_id,
        artist_title: artist_name,
        provenance_text: description,
        style_titles: tags,
        image_id: image_url
      },
      index
    ) => (
      <Grid key={index} item>
        <StoreTile
          artwork_id={artwork_id}
          artwork_name={artwork_name}
          artist_id={artist_id}
          artist_name={artist_name}
          description={description}
          rental_pricing={[
            { price: 10, period: "year" },
            { price: 20, period: "6 months" },
            { price: 50, period: "month" }
          ]}
          buy_price={1000}
          image_url={image_url}
          image_size={{
            width: index % 2 === 0 ? 400 : 200,
            height: index % 2 === 0 ? 400 : 200
          }}
          tags={tags}
        />
      </Grid>
    )
  );
}
