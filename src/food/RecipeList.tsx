import React, { useCallback, useContext } from "react";
import {
  RecipeSchemaContext,
  RecipeSchemaContextProvider,
  RecipeFilter,
} from "./schemas/RecipeSchemaContext";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { RecipeApi } from "../common/client/FoodApi";
import { Recipe } from "../common/client";

function Recipes() {
  const schemaContext = useContext(RecipeSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<RecipeFilter>) =>
      await RecipeApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.users,
        config.filter?.recipeCategories,
        config.filter?.cookbooks,
        config.filter?.recipeIngredients
      ),
    []
  );

  return (
    <>
      <SchemaTable<Recipe, RecipeFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Recipes, RecipeSchemaContextProvider);
