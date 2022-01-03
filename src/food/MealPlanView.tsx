import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MealPlan, MealPlanRecipe } from "../common/client";
import { MealPlanApi, MealPlanRecipeApi } from "../common/client/FoodApi";

import {
  MealPlanRecipeSchemaContext,
  MealPlanRecipeSchemaContextProvider,
} from "./MealPlanRecipeSchemaContext";
import withProvider from "../core/components/withProvider";
import { ListObjectEntity } from "../core/components/forms/ObjectEntityType";
import { FormSchema } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";

type MealPlanRecipeEdit = MealPlanRecipe & ListObjectEntity;

function MealPlanView() {
  const schemaContext = useContext(MealPlanRecipeSchemaContext);
  const params = useParams() as any;
  const [mealPlan, setMealPlan] = useState<MealPlan | undefined>(undefined);
  const [rows, setRows] = useState<MealPlanRecipeEdit[]>([]);
  useEffect(() => {
    MealPlanApi.get(params.mealPlanId).then((result) => setMealPlan(result));
  }, [params]);
  useEffect(() => {
    const editRows: MealPlanRecipeEdit[] = (
      mealPlan?.mealPlanRecipes ?? []
    ).map((r) => setNewRow(r as MealPlanRecipeEdit));
    setRows(editRows);
  }, [mealPlan]);

  const setNewRow = (mr: MealPlanRecipeEdit) =>
    ({
      ...mr,
      name: `${mr.recipe?.name} (${mr.count})`,
      path: `/food/recipes/${mr.recipe?.id}`,
    } as MealPlanRecipeEdit);

  const handleDelete = (mr: MealPlanRecipeEdit) =>
    MealPlanRecipeApi.delete(mr.id!);

  function getEntitySchema(obj?: MealPlanRecipeEdit) {
    return obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: { ...obj, mealPlan: { id: obj.mealPlanId } },
        }) as FormSchema<MealPlanRecipeEdit>)
      : (schemaContext.get({
          type: "ADD",
          obj: ({
            mealPlanId: mealPlan?.id,
            mealPlan: { ...mealPlan },
          } as unknown) as MealPlanRecipeEdit,
        }) as FormSchema<MealPlanRecipeEdit>);
  }
  return (
    <Fragment>
      <h1>{mealPlan?.name}</h1>
      <SchemaList
        title="Recipes"
        getEntitySchema={getEntitySchema}
        rows={rows}
        setNewRow={setNewRow}
        deleteEntity={handleDelete}
      />
    </Fragment>
  );
}

export default withProvider(MealPlanView, MealPlanRecipeSchemaContextProvider);
