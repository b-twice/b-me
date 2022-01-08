import React, { Fragment } from "react";
import { Grid, Typography } from "@mui/material";
import RecentBooksCard from "../books/RecentBooksCard";
import WeatherCard from "../weather/WeatherCard";
import RecentRecipesCard from "../food/RecentRecipes";

function Home() {
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        sx={{ mt: 4 }}
      >
        Dashboard
      </Typography>
      <Grid spacing={3} container justifyContent="center" mt={3}>
        <Grid item>
          <WeatherCard />
        </Grid>
        <Grid item>
          <RecentBooksCard />
        </Grid>
        <Grid item>
          <RecentRecipesCard />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Home;
