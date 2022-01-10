import React, { useImperativeHandle, forwardRef } from "react";
import Modal from "@mui/material/Modal";
import SchemaForm, { FormSchema } from "./SchemaForm";
import { ObjectEntity } from "./ObjectEntityType";
import { styled } from "@mui/system";

const Paper = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: (theme.shadows as any)[5],
}));

export interface EditModalProps<T> {
  schema: FormSchema<T>;
  onSaveSuccess(obj: { [key: string]: any }): void;
  onChange?(
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): void;
  saveText?: string;
}

export interface EditModalRef {
  handleOpen(): void;
}

const EditModal = forwardRef(
  <T extends ObjectEntity>(
    { schema, onSaveSuccess, onChange, saveText }: EditModalProps<T>,
    ref: any
  ) => {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState({});

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
      setOpen(false);
    };
    useImperativeHandle(ref, () => ({
      handleOpen() {
        setOpen(true);
      },
    }));

    const handleSave = (obj: { [key: string]: any }) => {
      handleClose();
      onSaveSuccess(obj);
    };

    return (
      <Modal open={open} onClose={handleClose}>
        <Paper style={modalStyle}>
          <SchemaForm
            schema={schema}
            onCancel={handleClose}
            onSaveSuccess={handleSave}
            saveText={saveText}
            onChange={onChange}
          />
        </Paper>
      </Modal>
    );
  }
);

export { EditModal };
