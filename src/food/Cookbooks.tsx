import React, { useCallback, useContext } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
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

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<CookbookFilter>) =>
      await CookbookApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.cookbookAuthors
      ),
    []
  );

  return (
    <>
      <SchemaTable<Cookbook, CookbookFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Cookbooks, CookbookSchemaContextProvider);
