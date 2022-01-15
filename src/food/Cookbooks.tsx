import React, { Fragment, useContext, useEffect } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import {
  CookbookSchemaContextProvider,
  CookbookSchemaContext,
  CookbookFilter,
} from "./schemas/CookbookSchemaContext";
import { Cookbook } from "../common/client";
import { CookbookApi } from "../common/client/FoodApi";

function Cookbooks() {
  const schemaContext = useContext(CookbookSchemaContext);

  const [page, setPage] = React.useState<PaginatedResult<Cookbook>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = React.useState(
    createSchemaTableConfig<CookbookFilter>()
  );

  useEffect(() => {
    CookbookApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name,
      config.filter.cookbookAuthors
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj: CookbookFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<Cookbook, CookbookFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        config={config}
        title={schemaContext.title}
      />
    </Fragment>
  );
}

export default withProvider(Cookbooks, CookbookSchemaContextProvider);
