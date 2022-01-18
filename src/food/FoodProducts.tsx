import React, { useCallback, useContext } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import {
  FoodProductSchemaContextProvider,
  FoodProductSchemaContext,
  FoodProductFilter,
} from "./schemas/FoodProductSchemaContext";
import { FoodProduct } from "../common/client";
import { FoodProductApi } from "../common/client/FoodApi";

function FoodProducts() {
  const schemaContext = useContext(FoodProductSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<FoodProductFilter>) =>
      await FoodProductApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.foodCategories,
        config.filter?.supermarkets
      ),
    []
  );

  return (
    <>
      <SchemaTable<FoodProduct, FoodProductFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(FoodProducts, FoodProductSchemaContextProvider);
