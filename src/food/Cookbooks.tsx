import React, { Fragment, useContext, useState, useEffect } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { CookbookApi } from "../common/client/FoodApi";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import {
  CookbookSchemaContextProvider,
  CookbookSchemaContext,
  CookbookFilter,
} from "./CookbookSchemaContext";
import { Cookbook } from "../common/client";

function Cookbooks() {
  const schemaContext = useContext(CookbookSchemaContext);

  const [filterSchema, setFilterSchema] = useState<FormSchema<CookbookFilter>>(
    () => schemaContext.get({ type: "FILTER" })
  );
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({
    ...schemaTableConfig,
    filter: schemaContext.get<CookbookFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    CookbookApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name,
      config.filter.cookbookAuthor
    ).then((result) => setPage(result as PaginatedResult));
  }, [config]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as Cookbook,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) => CookbookApi.delete(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as CookbookFilter });
    setFilterSchema({ ...filterSchema, object: obj as CookbookFilter });
  };

  return (
    <Fragment>
      <SchemaTable
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        onFilter={handleOnFilter}
        getEntitySchema={handleGetEntitySchema}
        deleteEntity={handleDeleteEntity}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Cookbooks"
      />
    </Fragment>
  );
}

export default withProvider(Cookbooks, CookbookSchemaContextProvider);
