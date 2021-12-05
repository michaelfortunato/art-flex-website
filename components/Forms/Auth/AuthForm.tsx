import { Grid, Typography, Divider } from "@material-ui/core";

export function SocialBanner(props: { fontSize?: string }) {
  return (
    <Grid container justifyContent="center">
      <Grid container alignItems="center" item xs>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid item xs="auto" style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Typography
          style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: props.fontSize }}
          variant="overline"
        >
          Or
        </Typography>
      </Grid>
      <Grid container alignItems="center" item xs>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default function AuthForm({
  children,
  bannerMarginTop,
  bannerMarginBottom
}: {
  children: any;
  bannerMarginTop?: Number;
  bannerMarginBottom?: Number;
}) {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        {children[0]}
      </Grid>
      <Grid
        style={{
          marginTop: `${bannerMarginTop || 16}px`,
          marginBottom: `${bannerMarginBottom || 16}px`
        }}
        item
        xs={12}
      >
        <div style={{ marginLeft: -36, marginRight: -36 }}>
          <SocialBanner fontSize="1rem" />
        </div>
      </Grid>
      <Grid item xs={12}>
        {children[1]}
      </Grid>
    </Grid>
  );
}
