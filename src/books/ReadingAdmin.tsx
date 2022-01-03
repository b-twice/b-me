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
import ListItemLink from "../core/components/ListItemLink";

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

function ReadingAdmin() {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        className={classes.title}
      >
        Reading Admin
      </Typography>
      <List component="div" dense>
        <ListItem>
          <ListItemLink path="/reading/authors" name="Reading" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink path="/reading/categories" name="Categories" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink path="/reading/statuses" name="Statuses" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
      </List>
    </Fragment>
  );
}

export default ReadingAdmin;
