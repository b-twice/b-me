import React, { Fragment } from "react";
import {
  Typography,
  createStyles,
  makeStyles,
  Theme,
  List,
  ListItem,
  ListItemIcon,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ListItemLink from "../ListItemLink";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("md")]: {
        justifyContent: "center",
      },
    },
    title: {
      marginTop: theme.spacing(4),
    },
  });
});

function LinkList({
  title,
  links,
}: {
  title: string;
  links: { path: string; title: string }[];
}) {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        className={classes.title}
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
