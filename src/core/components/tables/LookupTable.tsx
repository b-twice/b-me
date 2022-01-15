import React from "react";
import { useContext, useEffect, Fragment } from "react";
import { AppLookup } from "../../../common/client";
import { BaseTableClient } from "../../../common/client/BaseClient";
import { TableSchemaContextProps } from "../forms/EditSchemaContextProps.interface";
import SchemaTable, {
  SchemaTableConfig,
  PaginatedResult,
  createSchemaTableConfig,
  TableFilter,
} from "./SchemaTable";

export default function LookupTable({
  context,
  api,
}: {
  context: React.Context<TableSchemaContextProps<AppLookup, TableFilter>>;
  api: BaseTableClient<any>;
}) {
  const schemaContext = useContext(context);

  const [page, setPage] = React.useState<PaginatedResult<AppLookup>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = React.useState<SchemaTableConfig<TableFilter>>({
    ...createSchemaTableConfig(),
    sort: "name_asc",
    orderBy: "name",
    order: "asc",
  });

  useEffect(() => {
    api
      .getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name
      )
      .then((result) => setPage(result));
  }, [api, config]);

  const handleOnPage = (pageConfig: SchemaTableConfig<TableFilter>) =>
    setConfig(pageConfig);
  const handleOnFilter = (obj: TableFilter | undefined) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<AppLookup, TableFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title={schemaContext.title!}
      />
    </Fragment>
  );
}
