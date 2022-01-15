import React, { Fragment, useContext, useEffect, useState } from "react";
import { MealPlan, MealPlanRecipe } from "../common/client";
import withProvider from "../core/components/withProvider";
import { SchemaFormStates } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  MealPlanRecipeSchemaContext,
  MealPlanRecipeSchemaContextProvider,
} from "./schemas/MealPlanRecipeSchemaContext";

function MealPlanRecipeList({ mealPlan }: { mealPlan: MealPlan }) {
  const schemaContext = useContext(MealPlanRecipeSchemaContext);
  const [rows, setRows] = useState<MealPlanRecipe[]>([]);

  useEffect(() => {
    const editRows: MealPlanRecipe[] = mealPlan?.mealPlanRecipes ?? [];
    setRows(editRows);
  }, [mealPlan]);

  function onRowEdit(
    state: SchemaFormStates,
    obj: MealPlanRecipe
  ): MealPlanRecipe {
    if (state === "ADD") {
      return { ...obj, mealPlanId: mealPlan.id };
    }
    return obj;
  }

  return (
    <Fragment>
      <SchemaList<MealPlanRecipe>
        title={schemaContext.title}
        schema={schemaContext.schema}
        rows={rows}
        onRowEdit={onRowEdit}
      />
    </Fragment>
  );
}

export default withProvider(
  MealPlanRecipeList,
  MealPlanRecipeSchemaContextProvider
);
