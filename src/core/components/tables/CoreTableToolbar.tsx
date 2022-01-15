import React from "react";
import { Toolbar, Typography } from "@mui/material";
import { FormSchema } from "../forms/SchemaForm";
import CoreTableFilter from "./CoreTableFilter";
import { styled } from "@mui/system";

const Spacer = styled("div")({
  flex: "1 1 100%",
});

const Actions = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

interface CoreTableToolbarProps<F> {
  title: string;
  filterSchema?: FormSchema<F>;
  onFilter?: (obj: F) => void;
}

export default function CoreTableToolbar<F>({
  title,
  filterSchema,
  onFilter,
}: CoreTableToolbarProps<F>) {
  return (
    <Toolbar sx={{ pl: 2, pr: 1 }}>
      <Typography flex="0 0 auto" variant="h6" id="tableTitle">
        {title}
      </Typography>
      <Spacer />
      <Actions>
        {filterSchema && onFilter && (
          <CoreTableFilter<F> schema={filterSchema} onFilter={onFilter} />
        )}
      </Actions>
    </Toolbar>
  );
}
