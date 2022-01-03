import { createStyles, makeStyles, TableCell, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FieldSchema, TextFieldSchema } from "../forms/SchemaForm";
import CheckIcon from "@material-ui/icons/Check";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    link: {
      color: "inherit",
    },
  });
});

interface SchemaTableCellProps {
  property: string;
  fieldSchema: FieldSchema;
  row: any;
}
function SchemaTableCell({ property, fieldSchema, row }: SchemaTableCellProps) {
  const [path, setPath] = useState("");
  const classes = useStyles();
  useEffect(() => {
    if (fieldSchema.type === "text" && (fieldSchema as TextFieldSchema).path)
      setPath((fieldSchema as TextFieldSchema).path!(row));
  }, [fieldSchema, row]);
  if (fieldSchema.type === "switch")
    return (
      <TableCell>
        {row[property] === 1 ? <CheckIcon /> : <span></span>}
      </TableCell>
    );
  else if (fieldSchema.type === "text" && (fieldSchema as TextFieldSchema).path)
    return (
      <TableCell>
        <NavLink exact to={path} className={classes.link}>
          {fieldSchema.getVal
            ? fieldSchema.getVal(row[property])
            : row[property]}
        </NavLink>
      </TableCell>
    );
  else
    return (
      <TableCell>
        {fieldSchema.getVal ? fieldSchema.getVal(row[property]) : row[property]}
      </TableCell>
    );
}

export default SchemaTableCell;
