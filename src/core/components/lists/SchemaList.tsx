import React, {
  Fragment,
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
import { ListObjectEntity } from "../forms/ObjectEntityType";
import { FormSchema } from "../forms/SchemaForm";
import ListItemLink from "../ListItemLink";
import listReducer from "./ListReducer";
import { AuthContext } from "../../Auth";

interface SchemaListProps<T> {
  rows: T[];
  title: string;
  getEntitySchema(obj?: T): FormSchema<T>;
  setNewRow(obj?: T): T;
  deleteEntity(obj: T): Promise<void>;
  onChange?: (
    schema: FormSchema<T>,
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ) => Promise<FormSchema<T> | undefined>;
}

function SchemaList<T extends ListObjectEntity>({
  title,
  getEntitySchema,
  deleteEntity,
  setNewRow,
  rows,
  onChange,
}: SchemaListProps<T>) {
  const authContext = useContext(AuthContext);
  const modalRef = useRef<EditModalRef>(null);
  const [state, dispatch] = useReducer(listReducer<T>(), []);
  const [appMessage, setAppMessage] = React.useState("");

  const [schema, setEditSchema] = useState<FormSchema<T>>(() =>
    getEntitySchema()
  );

  useEffect(() => {
    dispatch({
      type: "LOAD",
      rows: rows,
    });
  }, [rows]);

  function handleDelete(row: T) {
    deleteEntity(row)
      .then(() => {
        setAppMessage("Entity deleted.");
        dispatch({ type: "DELETE", row: row });
      })
      .catch((err) => {
        console.error(err);
        setAppMessage("Delete failed, unexpected error.");
      });
  }

  function handleEdit(row?: T) {
    if (row && onChange) {
      const schema = getEntitySchema(row);
      const asyncNewSchema = onChange(schema, schema.object, schema.object);
      asyncNewSchema.then((newSchema) =>
        newSchema ? setEditSchema(newSchema) : setEditSchema(schema)
      );
    } else {
      setEditSchema(getEntitySchema(row));
    }
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleOnEditSaveSuccess(row: T) {
    row = setNewRow(row);
    if (schema.type === "ADD") {
      setAppMessage("Entity added.");
      dispatch({ type: "ADD", row: row });
    } else if (schema.type === "EDIT") {
      setAppMessage("Entity saved.");
      dispatch({ type: "EDIT", row: row });
    }
    getEntitySchema();
  }

  /**
   * Purpose of this is allow an asyncronous call to be made to then update the schema
   * such as in updating the help text
   * @param obj
   * @param changeObj
   */
  function handleOnFormChange(
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): void {
    if (onChange) {
      const asyncNewSchema = onChange(schema as FormSchema<T>, obj, changeObj);
      asyncNewSchema.then((newSchema) =>
        newSchema !== undefined ? setEditSchema(newSchema) : undefined
      );
    }
  }

  return (
    <Fragment>
      <Typography color="textSecondary" variant="h6" gutterBottom={false}>
        {title}
      </Typography>
      <List component="div" dense>
        {state.map((o) => (
          <ListItem key={o.id}>
            <ListItemIcon>
              <ArrowRightIcon color="inherit" />
            </ListItemIcon>
            <ListItemText>
              {o.path && <ListItemLink path={o.path} name={o.name!} />}
              {!o.path && o.name}
            </ListItemText>
            {authContext.authenticated && (
              <Fragment>
                <IconButton onClick={() => handleEdit(o)} size="large">
                  <EditIcon color="inherit" />
                </IconButton>
                <IconButton onClick={() => handleDelete(o)} size="large">
                  <DeleteIcon color="inherit" />
                </IconButton>
              </Fragment>
            )}
          </ListItem>
        ))}
      </List>
      <AppSnackbar message={appMessage} onClose={() => setAppMessage("")} />
      <EditModal
        ref={modalRef}
        schema={schema}
        onSaveSuccess={handleOnEditSaveSuccess}
        onChange={handleOnFormChange}
      />

      {authContext.authenticated && (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleEdit()}
        >
          Add
        </Button>
      )}
    </Fragment>
  );
}

export default SchemaList;
