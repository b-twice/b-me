import React, { Fragment } from "react";
import { Typography, List, ListItem, ListItemIcon } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ListItemLink from "../ListItemLink";

function LinkList({
  title,
  links,
}: {
  title: string;
  links: { path: string; title: string }[];
}) {
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        sx={{ mt: 4 }}
      >
        {title}
      </Typography>
      <List component="div" dense>
        {links.map((l) => (
          <ListItem key={l.path}>
            <ListItemLink path={l.path} name={l.title} />
            <ListItemIcon>
              <ArrowRightIcon color="inherit" />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
}

export default LinkList;
