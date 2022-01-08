import TableCell from "@mui/material/TableCell";
import React, { useEffect, useState } from "react";
import { FieldSchema, TextFieldSchema } from "../forms/SchemaForm";
import CheckIcon from "@mui/icons-material/Check";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";

const Link = styled(NavLink)({
  color: "inherit",
});

interface SchemaTableCellProps {
  property: string;
  fieldSchema: FieldSchema;
  row: any;
}
function SchemaTableCell({ property, fieldSchema, row }: SchemaTableCellProps) {
  const [path, setPath] = useState("");
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
        <Link to={path}>
          {fieldSchema.getVal
            ? fieldSchema.getVal(row[property])
            : row[property]}
        </Link>
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
