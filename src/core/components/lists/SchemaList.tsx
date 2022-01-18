import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  IconButton,
  Button,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppSnackbar from "../AppSnackbar";
import { EditModalRef, EditModal } from "../forms/EditModal";
import { ListFormSchema, SchemaFormStates } from "../forms/SchemaForm";
import ListItemLink from "../ListItemLink";
import SchemaListReducer from "./ListReducer";
import { AuthContext } from "../../Auth";

interface SchemaListProps<T> {
  rows: T[];
  title: string;
  schema: ListFormSchema<T>;
  onRowEdit?(state: SchemaFormStates, obj?: T): T;
  onChange?: (
    schema: ListFormSchema<T>,
    obj: T,
    changeObj: Partial<T>
  ) => Promise<ListFormSchema<T> | undefined>;
}

function SchemaList<T>({
  title,
  schema,
  onRowEdit,
  rows,
  onChange,
}: SchemaListProps<T>) {
  const authContext = useContext(AuthContext);
  const modalRef = useRef<EditModalRef>(null);
  const [state, dispatch] = useReducer(SchemaListReducer<T>(), []);
  const [appMessage, setAppMessage] = React.useState("");

  const [editSchema, setEditSchema] = useState<ListFormSchema<T>>(() => schema);
  const [editRow, setEditRow] = useState<T>({} as T);
  const [editState, setEditState] = useState<SchemaFormStates | undefined>();

  useEffect(() => setEditSchema(schema), [schema]);

  useEffect(() => {
    dispatch({
      type: "LOAD",
      rows: rows,
    });
  }, [rows]);

  function handleDelete(row: T) {
    if (editSchema.delete) {
      editSchema
        .delete(row)
        .then(() => {
          setAppMessage("Entity deleted.");
          dispatch({ type: "DELETE", row: row });
        })
        .catch((err) => {
          console.error(err);
          setAppMessage("Delete failed, unexpected error.");
        });
    }
  }

  async function startEdit(state: SchemaFormStates, row?: T) {
    row = onRowEdit ? onRowEdit(state, row) : row;
    if (row && onChange) {
      const newSchema = await onChange(schema, row, row);
      if (newSchema) {
        setEditSchema(newSchema);
      }
    }
    setEditRow(row ?? ({} as T));
    setEditState(state);
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleOnEditSaveSuccess(row: T) {
    if (editState === "ADD") {
      setAppMessage("Entity added.");
      dispatch({ type: "ADD", row: row });
    } else if (editState === "EDIT") {
      setAppMessage("Entity saved.");
      dispatch({ type: "EDIT", row: row });
    }
    setEditSchema(schema);
    if (schema.repeatAdd && editState === "ADD") {
      startEdit("ADD").then();
    }
  }

  /**
   * Purpose of this is allow an asyncronous call to be made to then update the schema
   * such as in updating the help text
   * @param obj
   * @param changeObj
   */
  function handleOnFormChange(obj: T, changeObj: Partial<T>): void {
    if (onChange) {
      const asyncNewSchema = onChange(
        schema as ListFormSchema<T>,
        obj,
        changeObj
      );
      asyncNewSchema.then((newSchema) =>
        newSchema ? setEditSchema(newSchema) : newSchema
      );
    }
  }

  return (
    <>
      <Typography color="textSecondary" variant="h6" gutterBottom={false}>
        {title}
      </Typography>
      <List component="div" dense>
        {state
          .map((o) => ({ o: o, display: schema.display(o) }))
          .map(({ o, display }) => (
            <ListItem key={display.id}>
              <ListItemIcon>
                <ArrowRightIcon color="inherit" />
              </ListItemIcon>
              <ListItemText>
                {display.path && (
                  <ListItemLink path={display.path} name={display.name!} />
                )}
                {!display.path && display.name}
              </ListItemText>
              {authContext.authenticated && (
                <>
                  <IconButton
                    onClick={() => startEdit("EDIT", o).then()}
                    size="large"
                  >
                    <EditIcon color="inherit" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(o)} size="large">
                    <DeleteIcon color="inherit" />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
      </List>
      <AppSnackbar message={appMessage} onClose={() => setAppMessage("")} />
      <EditModal
        ref={modalRef}
        schema={editSchema}
        obj={editRow}
        editState={editState!}
        onSaveSuccess={handleOnEditSaveSuccess}
        onChange={handleOnFormChange}
      />

      {authContext.authenticated && (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => startEdit("ADD").then()}
        >
          Add
        </Button>
      )}
    </>
  );
}

export default SchemaList;
