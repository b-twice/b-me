import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  RecipeSchemaContext,
  RecipeSchemaContextProvider,
  RecipeFilter,
  RecipesTableConfig,
} from "./RecipeListSchemaContext";
import { Recipe } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import { RecipeApi } from "../common/client/FoodApi";

function Recipes() {
  const schemaContext = useContext(RecipeSchemaContext);

  const [filterSchema, setFilterSchema] = useState<FormSchema<RecipeFilter>>(
    () => schemaContext.get({ type: "FILTER" })
  );
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<RecipesTableConfig>({
    ...schemaTableConfig,
    filter: schemaContext.get<RecipeFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    RecipeApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name,
      config.filter.user.map((b) => b.id as number),
      config.filter.recipeCategory.map((b) => b.id as number),
      config.filter.cookbook.map((b) => b.id as number),
      config.filter.recipeIngredients.map((b) => b.id as number)
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
          obj: obj as Recipe,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) => RecipeApi.delete(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as RecipesTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as RecipeFilter });
    setFilterSchema({ ...filterSchema, object: obj as RecipeFilter });
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
        title="Recipes"
      />
    </Fragment>
  );
}

export default withProvider(Recipes, RecipeSchemaContextProvider);
