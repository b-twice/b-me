import React, { useRef, Fragment, useState, useEffect } from "react";
import { Tooltip, IconButton, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CancelIcon from "@mui/icons-material/Cancel";
import { FormSchema } from "../forms/SchemaForm";
import { EditModalRef, EditModal } from "../forms/EditModal";
import { SchemaTableConfig } from "./SchemaTable";

interface CoreTableFilterProps<F> {
  schema: FormSchema<F>;
  config: SchemaTableConfig<F>;
  onFilter: (obj: F | undefined) => void;
}

export default function CoreTableFilter<F>({
  schema,
  config,
  onFilter,
}: CoreTableFilterProps<F>) {
  const modalRef = useRef<EditModalRef>(null);

  const [isActive, setIsActive] = useState(false);

  function handleFilter() {
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleFilterSave(obj: F) {
    onFilter(obj);
  }

  function handleCancel() {
    onFilter(undefined);
    setIsActive(false);
  }

  useEffect(() => {
    /**
     * Two states can be derived - Whether the filter is clear (no values) or a filter is applied (there is a value)
     * This function analyzes the object to determine the state
     * @param obj
     */
    const filterHasValue = (obj: F | undefined) => {
      if (obj === undefined) return false;
      let values = Object.values(obj);
      for (let v of values) {
        if (v !== null && v !== undefined) {
          if (typeof v === "string" && v !== "") {
            return true;
          } else if (typeof v === "number" || typeof v === "boolean") {
            return true;
          } else if (v instanceof Array && v.length > 0) {
            return true;
          } else if (Object.entries(v).length > 0 && v.constructor === Object) {
            return true;
          }
        }
      }
      return false;
    };
    setIsActive(filterHasValue(config.filter));
  }, [config.filter]);

  return (
    <Fragment>
      <Stack flexDirection="row">
        <Tooltip title="Filter list">
          <IconButton
            aria-label="filter list"
            onClick={handleFilter}
            color={isActive ? "secondary" : "default"}
            size="large"
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        {isActive && (
          <Tooltip title="Cancel Filter">
            <IconButton
              aria-label="cancel filter"
              onClick={handleCancel}
              size="large"
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <EditModal
        ref={modalRef}
        obj={config.filter ?? ({} as F)}
        schema={schema}
        editState={"FILTER"}
        onSaveSuccess={handleFilterSave}
        saveText="Apply"
      />
    </Fragment>
  );
}
