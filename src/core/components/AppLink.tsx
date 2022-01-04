import { NavLink, NavLinkProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    link: {
      color: "inherit",
      textDecoration: "none",
    },
    linkActive: {
      color: theme.palette.secondary.main,
      fontWeight: 700,
    },
  });
});

const AppLink = (props: NavLinkProps) => {
  const classes = useStyles();
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(classes.link, isActive ? classes.linkActive : undefined)
      }
    />
  );
};
export default AppLink;
