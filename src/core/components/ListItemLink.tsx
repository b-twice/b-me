import React from "react";
import { ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";

const Link = styled(NavLink)(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  "&.active": {
    color: theme.palette.secondary.main,
  },
}));
function ListItemLink(props: {
  path: string;
  name: string;
  secondary?: string;
  onClick?(): void;
  nested?: boolean;
}) {
  const { path, name, onClick, nested, secondary } = props;
  return (
    <Link to={path} onClick={onClick}>
      <ListItem
        button
        sx={{
          ...(nested === true && {
            paddingLeft: 4,
          }),
        }}
      >
        <ListItemText primary={name} secondary={secondary} />
      </ListItem>
    </Link>
  );
}

export default ListItemLink;
