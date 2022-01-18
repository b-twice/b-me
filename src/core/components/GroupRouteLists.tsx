import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemLink from "./ListItemLink";
import { useLocation } from "react-router-dom";

export type RouteItem = {
  path: string;
  title: string;
};

export interface GroupRouteListProps {
  title: string;
  items: RouteItem[];
  onClick?(): void;
  nested?: boolean;
}

function GroupRouteList({
  title,
  items,
  onClick,
  nested,
}: GroupRouteListProps) {
  const location = useLocation();

  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  /* Expand/collapse based on route changes */
  useEffect(() => {
    const hasPathName = (pathName: string): boolean => {
      return items.find((item) => pathName.includes(item.path)) ? true : false;
    };
    if (hasPathName(location.pathname)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [location.pathname, items]);

  const listItems = items.map((item) => (
    <ListItemLink
      key={item.path}
      path={item.path}
      name={item.title}
      onClick={onClick}
      nested={nested}
    />
  ));
  return (
    <List disablePadding component="div">
      <ListItem button onClick={handleClick}>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {listItems}
      </Collapse>
    </List>
  );
}

export default GroupRouteList;
