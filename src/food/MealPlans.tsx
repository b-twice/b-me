import React, { useCallback, useContext } from "react";
import {
  MealPlanSchemaContext,
  MealPlanSchemaContextProvider,
  MealPlanFilter,
} from "./schemas/MealPlanSchemaContext";
import { MealPlan } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { MealPlanApi } from "../common/client/FoodApi";

function MealPlans() {
  const schemaContext = useContext(MealPlanSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<MealPlanFilter>) =>
      await MealPlanApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.users,
        config.filter?.recipes,
        config.filter?.years,
        config.filter?.months
      ),
    []
  );

  return (
    <>
      <SchemaTable<MealPlan, MealPlanFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(MealPlans, MealPlanSchemaContextProvider);
