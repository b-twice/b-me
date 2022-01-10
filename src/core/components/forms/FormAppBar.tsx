import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";

interface FormAppBarProps {
  title: string;
  onCancel(): void;
  isSaving: boolean;
  saveText?: string;
}

export default function FormAppBar({
  title,
  onCancel,
  isSaving,
  saveText,
}: FormAppBarProps) {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton
          type="button"
          edge="start"
          sx={{ mr: 2 }}
          color="inherit"
          aria-label="menu"
          onClick={onCancel}
          size="large"
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" flexGrow={1}>
          {title}
        </Typography>
        <Button type="submit" color="inherit" disabled={isSaving}>
          {saveText || "Save"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
