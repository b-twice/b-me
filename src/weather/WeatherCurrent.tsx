import React, { Fragment } from "react";
import { Typography, Grid } from "@mui/material";
import { DataPoint } from "../common/client";
import WeatherIcon from "./WeatherIcon";

interface WeatherCurrentProps {
  current: DataPoint;
  day: DataPoint;
}

function WeatherCurrent({ current, day }: WeatherCurrentProps) {
  return (
    <>
      <Typography color="textSecondary" gutterBottom>
        {current.apparentTemperature && current.apparentTemperature.toFixed(0)}
        &#176; {current.summary}
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={1}
      >
        <Grid item flex={1}>
          <Grid container direction="row" justifyContent="center">
            <Grid item>
              <WeatherIcon type={current.icon!} size="large" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" alignItems="flex-end" spacing={0}>
            <Grid item>
              <Typography
                display="inline-block"
                fontWeight="medium"
                variant="body2"
              >
                Temp:{" "}
              </Typography>
              <Typography display="inline-block" variant="body2">
                {day.apparentTemperatureHigh &&
                  day.apparentTemperatureHigh.toFixed(0)}
                &#176;
              </Typography>
              <Typography
                display="inline-block"
                variant="body2"
                color="textSecondary"
              >
                {" "}
                |{" "}
                {day.apparentTemperatureLow &&
                  day.apparentTemperatureLow.toFixed(0)}
                &#176;
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                display="inline-block"
                fontWeight="medium"
                variant="body2"
              >
                Humidity:{" "}
              </Typography>
              <Typography display="inline-block" variant="body2">
                {current.humidity && (current.humidity * 100).toFixed(0)}%
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                display="inline-block"
                fontWeight="medium"
                variant="body2"
              >
                Wind:{" "}
              </Typography>
              <Typography display="inline-block" variant="body2">
                {current.windSpeed && current.windSpeed.toFixed(0)} mph
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                display="inline-block"
                fontWeight="medium"
                variant="body2"
              >
                Rain:{" "}
              </Typography>
              <Typography display="inline-block" variant="body2">
                {day.precipProbability &&
                  (day.precipProbability * 100).toFixed(0)}
                %
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default WeatherCurrent;
