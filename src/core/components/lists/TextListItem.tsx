import React from "react";
import { ListItem, ListItemText } from "@mui/material";

export default function TextListItem({
  button = false,
  content,
  side,
  ...props
}: { button: boolean; content: JSX.Element; side: JSX.Element } & any) {
  return (
    <ListItem
      button={button}
      {...props}
      sx={[...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    >
      <ListItemText primary={<>{content}</>}></ListItemText>
      {side}
    </ListItem>
  );
}
