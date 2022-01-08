import React, { useEffect } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

interface AppSnackbarProps {
  duration?: number;
  message: string;
  onClose?: () => void;
}

function AppSnackbar({ message, duration, onClose }: AppSnackbarProps) {
  const [open, setOpen] = React.useState(false);

  function handleClose(
    event: React.SyntheticEvent<any, Event> | Event,
    reason?: SnackbarCloseReason
  ) {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }

  useEffect(() => {
    if (message !== null && message !== "") {
      setOpen(true);
    }
  }, [message]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={duration || 2000}
      onClose={handleClose}
      ContentProps={{ "aria-describedby": "message-id" }}
      message={<span id="message-id">{message}</span>}
      action={[]}
    />
  );
}

export default AppSnackbar;
