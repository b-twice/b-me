import React from "react";
import { Typography, Grid, TypographyProps } from "@mui/material";
import TextListItem from "./TextListItem";

export default function ButtonSplitTextListItem({
  left,
  right,
  handleClick,
  ...typographyProps
}: { left: any; right: any; handleClick: Function } & TypographyProps) {
  return (
    <TextListItem
      onClick={handleClick}
      button
      content={
        <Typography {...typographyProps}>
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
