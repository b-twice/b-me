import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  FoodProductSchemaContext,
  FoodProductSchemaContextProvider,
  FoodProductFilter,
  FoodProductsTableConfig,
} from "./FoodProductSchemaContext";
import { FoodProduct } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import { FoodProductApi } from "../common/client/FoodApi";

function FoodProducts() {
  const schemaContext = useContext(FoodProductSchemaContext);

  const [filterSchema, setFilterSchema] = useState<
    FormSchema<FoodProductFilter>
  >(() => schemaContext.get({ type: "FILTER" }));
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<FoodProductsTableConfig>({
    ...schemaTableConfig,
    filter: schemaContext.get<FoodProductFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    FoodProductApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name,
      config.filter.foodCategory.map((b) => b.id as number),
      config.filter.supermarket.map((b) => b.id as number)
    ).then((result) => setPage(result as PaginatedResult));
  }, [config]);

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({ type: "FILTER" }));
  }, [schemaContext]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as FoodProduct,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) =>
    FoodProductApi.delete(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as FoodProductsTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as FoodProductFilter });
    setFilterSchema({ ...filterSchema, object: obj as FoodProductFilter });
  };

  return (
    <Fragment>
      <SchemaTable
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        getEntitySchema={handleGetEntitySchema}
        deleteEntity={handleDeleteEntity}
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Products"
      />
    </Fragment>
  );
}

export default withProvider(FoodProducts, FoodProductSchemaContextProvider);
