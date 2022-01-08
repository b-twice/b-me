import React from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

export default function AppSpinner() {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <CircularProgress sx={{ m: 2 }} color="secondary" />
    </Grid>
  );
}
