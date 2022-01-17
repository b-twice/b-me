import TableCell from "@mui/material/TableCell";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { FieldSchema } from "../forms/SchemaForm";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import {
  isRatingFieldSchema,
  isTextFieldSchema,
} from "../forms/fields/FieldGuards";
import AppIcon from "../icons/AppIcon";
import FormRating from "../forms/fields/FormRating";
import Link from "@mui/material/Link";

const StyledLink = styled(NavLink)({
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
    if (
      isTextFieldSchema(fieldSchema) &&
      fieldSchema.path &&
      fieldSchema.path(row)
    )
      setPath(fieldSchema.path(row)!);
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
        {path.startsWith("http") && (
          <Link color="secondary" href={path} underline="hover">
            {fieldSchema.getVal
              ? fieldSchema.getVal(row[property], row)
              : row[property]}
          </Link>
        )}
        {!path.startsWith("http") && (
          <StyledLink to={path}>
            {fieldSchema.getVal
              ? fieldSchema.getVal(row[property], row)
              : row[property]}
          </StyledLink>
        )}
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
        {fieldSchema.getVal
          ? fieldSchema.getVal(row[property], row)
          : row[property]}
      </TableCell>
    );
}

export default SchemaTableCell;
