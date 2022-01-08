import React from "react";
import { Toolbar, Typography } from "@mui/material";
import { FormSchema } from "../forms/SchemaForm";
import CoreTableFilter from "./CoreTableFilter";
import { ObjectEntity } from "../forms/ObjectEntityType";
import { styled } from "@mui/system";

const Spacer = styled("div")({
  flex: "1 1 100%",
});

const Actions = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

interface CoreTableToolbarProps<T> {
  title: string;
  filterSchema?: FormSchema<T>;
  onFilter?: (obj: T) => void;
}

export default function CoreTableToolbar<T extends ObjectEntity>({
  title,
  filterSchema,
  onFilter,
}: CoreTableToolbarProps<T>) {
  return (
    <Toolbar sx={{ pl: 2, pr: 1 }}>
      <Typography flex="0 0 auto" variant="h6" id="tableTitle">
        {title}
      </Typography>
      <Spacer />
      <Actions>
        {filterSchema && onFilter && (
          <CoreTableFilter schema={filterSchema} onFilter={onFilter} />
        )}
      </Actions>
    </Toolbar>
  );
}
