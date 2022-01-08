import React, { useContext, useState } from "react";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { IconButton } from "@mui/material";
import { AppThemeContext } from "../../theme/AppThemeContext";

export default function ThemeToggleButton() {
  const themeContext = useContext(AppThemeContext);

  const [isActive, setIsActive] = useState(false);
  const handleColorChange = () => {
    const theme: { type: "DARK" | "LIGHT" } = isActive
      ? { type: "LIGHT" }
      : { type: "DARK" };
    themeContext.dispatch(theme);
    setIsActive(!isActive);
  };

  return (
    <IconButton onClick={handleColorChange} size="large">
      <InvertColorsIcon />
    </IconButton>
  );
}
