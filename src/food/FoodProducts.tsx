import React, { Fragment, useContext, useEffect } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
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

  const [page, setPage] = React.useState<PaginatedResult<FoodProduct>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = React.useState(
    createSchemaTableConfig<FoodProductFilter>()
  );

  useEffect(() => {
    FoodProductApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.name,
      config.filter?.foodCategories,
      config.filter?.supermarkets
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj?: FoodProductFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<FoodProduct, FoodProductFilter>
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

export default withProvider(FoodProducts, FoodProductSchemaContextProvider);
