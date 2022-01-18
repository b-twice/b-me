import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { AuthContext } from "../../Auth";

interface AddModalProps {
  onAdd: () => void;
}

export default function AddModal({ onAdd }: AddModalProps) {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.authenticated && (
        <Fab
          color="secondary"
          aria-label="add"
          sx={(theme) => ({
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
          })}
          onClick={onAdd}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
}
