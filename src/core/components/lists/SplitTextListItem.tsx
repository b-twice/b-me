import React from "react";
import { Typography, Grid, TypographyProps } from "@mui/material";
import TextListItem from "./TextListItem";
import { SxProps, Theme } from "@mui/material/styles";

export default function SplitTextListItem({
  left,
  right,
  sx,
  typography,
}: {
  left: any;
  right: any;
  sx?: SxProps<Theme>;
  typography?: TypographyProps;
}) {
  return (
    <TextListItem
      content={
        <Typography {...typography} sx={{ ...sx }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            spacing={0}
          >
            <Grid item>{left}</Grid>
            <Grid item>{right}</Grid>
          </Grid>
        </Typography>
      }
    />
  );
}
