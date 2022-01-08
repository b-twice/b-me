import React from "react";
import Icon, { IconProps } from "@mui/material/Icon";

export default function AppIcon(props: IconProps) {
  return (
    <Icon
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      {...props}
    />
  );
}
