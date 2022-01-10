import TableCell from "@mui/material/TableCell";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { FieldSchema, TextFieldSchema } from "../forms/SchemaForm";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import {
  isRatingFieldSchema,
  isTextFieldSchema,
} from "../forms/fields/FieldGuards";
import AppIcon from "../icons/AppIcon";
import FormRating from "../forms/fields/FormRating";

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
    if (isTextFieldSchema(fieldSchema) && fieldSchema.path)
      setPath((fieldSchema as TextFieldSchema).path!(row));
  }, [fieldSchema, row]);
  if (fieldSchema.type === "switch")
    return (
      <TableCell>
        {row[property] === 1 ? <CheckIcon /> : <span></span>}
      </TableCell>
    );
  else if (isTextFieldSchema(fieldSchema) && fieldSchema.path)
    return (
      <TableCell>
        <Link to={path}>
          {fieldSchema.getVal
            ? fieldSchema.getVal(row[property])
            : row[property]}
        </Link>
      </TableCell>
    );
  else if (isRatingFieldSchema(fieldSchema)) {
    return (
      <TableCell>
        <FormRating
          schema={fieldSchema}
          size={fieldSchema.size ?? "small"}
          readOnly
          sx={{
            ...(fieldSchema.icon === "favorite" && {
              "& .MuiRating-iconFilled": {
                color: "#ff6d75",
              },
              "& .MuiRating-iconHover": {
                color: "#ff3d47",
              },
            }),
          }}
          value={row[property]}
          icon={<AppIcon fontSize="inherit" type={fieldSchema.icon} />}
          emptyIcon={
            <AppIcon
              style={{ display: "none" }}
              fontSize="inherit"
              type={fieldSchema.icon}
            />
          }
        />
      </TableCell>
    );
  } else
    return (
      <TableCell>
        {fieldSchema.getVal ? fieldSchema.getVal(row[property]) : row[property]}
      </TableCell>
    );
}

export default SchemaTableCell;
