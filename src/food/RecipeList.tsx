import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  RecipeSchemaContext,
  RecipeSchemaContextProvider,
  RecipeFilter,
} from "./schemas/RecipeSchemaContext";
import { Recipe } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { RecipeApi } from "../common/client/FoodApi";

function Recipes() {
  const schemaContext = useContext(RecipeSchemaContext);

  const [page, setPage] = useState<PaginatedResult<Recipe>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(createSchemaTableConfig<RecipeFilter>());

  useEffect(() => {
    RecipeApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.name,
      config.filter?.users,
      config.filter?.recipeCategories,
      config.filter?.cookbooks,
      config.filter?.recipeIngredients
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj?: RecipeFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<Recipe, RecipeFilter>
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

export default withProvider(Recipes, RecipeSchemaContextProvider);
