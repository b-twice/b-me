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

function FoodAdmin() {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        className={classes.title}
      >
        Food Admin
      </Typography>
      <List component="div" dense>
        <ListItem>
          <ListItemLink path="/food/products" name="Products" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink path="/food/cookbookAuthors" name="Cookbook Authors" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink path="/food/cookbooks" name="Cookbooks" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink path="/food/supermarkets" name="Supermarkets" />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink
            path="/food/recipeCategories"
            name="Recipe Categories"
          />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemLink
            path="/food/productCategories"
            name="Product Categories"
          />
          <ListItemIcon>
            <ArrowRightIcon color="inherit" />
          </ListItemIcon>
        </ListItem>
      </List>
    </Fragment>
  );
}

export default FoodAdmin;
