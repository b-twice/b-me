import React, { Fragment, useContext, useState, useEffect } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { CookbookAuthorApi } from "../common/client/FoodApi";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import {
  CookbookAuthorSchemaContextProvider,
  CookbookAuthorSchemaContext,
} from "./CookbookAuthorSchemaContext";
import { CookbookAuthor } from "../common/client";
import { LookupEntityFilter } from "../core/components/forms/lookups/LookupEntity.interface";

function CookbookAuthors() {
  const schemaContext = useContext(CookbookAuthorSchemaContext);

  const [filterSchema, setFilterSchema] = useState<
    FormSchema<LookupEntityFilter>
  >(() => schemaContext.get({ type: "FILTER" }));
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({
    ...schemaTableConfig,
    sort: "name_asc",
    orderBy: "name",
    order: "asc",
  });

  useEffect(() => {
    CookbookAuthorApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name
    ).then((result) => setPage(result as PaginatedResult));
  }, [config]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as CookbookAuthor,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) =>
    CookbookAuthorApi.delete(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as LookupEntityFilter });
    setFilterSchema({ ...filterSchema, object: obj as LookupEntityFilter });
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
        title="Cookbook Authors"
      />
    </Fragment>
  );
}

export default withProvider(
  CookbookAuthors,
  CookbookAuthorSchemaContextProvider
);
