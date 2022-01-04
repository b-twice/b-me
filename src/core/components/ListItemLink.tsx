import React from "react";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme, ListItem, ListItemText } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    listNested: {
      paddingLeft: theme.spacing(4),
    },
    link: {
      color: "inherit",
      textDecoration: "none",
    },
    linkActive: {
      color: theme.palette.secondary.main,
    },
  });
});

function ListItemLink(props: {
  path: string;
  name: string;
  secondary?: string;
  onClick?(): void;
  nested?: boolean;
}) {
  const { path, name, onClick, nested, secondary } = props;
  const classes = useStyles();
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(classes.link, isActive ? classes.linkActive : undefined)
      }
    >
      <ListItem className={clsx({ [classes.listNested]: nested })} button>
        <ListItemText primary={name} secondary={secondary} />
      </ListItem>
    </NavLink>
  );
}

export default ListItemLink;
