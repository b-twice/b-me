import React, { useCallback, useMemo } from "react";
import { useContext } from "react";
import { AppLookup } from "../../../common/client";
import { BaseTableClient } from "../../../common/client/BaseClient";
import { TableSchemaContextProps } from "../forms/EditSchemaContextProps.interface";
import SchemaTable, { SchemaTableConfig, TableFilter } from "./SchemaTable";

export default function LookupTable({
  context,
  api,
}: {
  context: React.Context<TableSchemaContextProps<AppLookup, TableFilter>>;
  api: BaseTableClient<any>;
}) {
  const schemaContext = useContext(context);

  const configOptions = useMemo<Partial<SchemaTableConfig<TableFilter>>>(
    () => ({ sort: "name_asc", orderBy: "name", order: "asc" }),
    []
  );

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<TableFilter>) =>
      await api.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name
      ),
    [api]
  );

  return (
    <>
      <SchemaTable<AppLookup, TableFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        configOptions={configOptions}
        title={schemaContext.title!}
      />
    </>
  );
}
