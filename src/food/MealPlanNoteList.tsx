import React, { Fragment, useContext, useEffect, useState } from "react";
import { MealPlan, MealPlanNote } from "../common/client";
import withProvider from "../core/components/withProvider";
import { SchemaFormStates } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  MealPlanNoteSchemaContext,
  MealPlanNoteSchemaContextProvider,
} from "./schemas/MealPlanNoteSchemaContext";

function MealPlanNoteList({ mealPlan }: { mealPlan: MealPlan }) {
  const schemaContext = useContext(MealPlanNoteSchemaContext);
  const [rows, setRows] = useState<MealPlanNote[]>([]);

  useEffect(() => {
    const editRows: MealPlanNote[] = mealPlan?.mealPlanNotes ?? [];
    setRows(editRows);
  }, [mealPlan]);

  function onRowEdit(state: SchemaFormStates, obj: MealPlanNote): MealPlanNote {
    if (state === "ADD") {
      return { ...obj, mealPlanId: mealPlan.id };
    }
    return obj;
  }

  return (
    <Fragment>
      <SchemaList<MealPlanNote>
        title={schemaContext.title}
        schema={schemaContext.schema}
        rows={rows}
        onRowEdit={onRowEdit}
      />
    </Fragment>
  );
}

export default withProvider(
  MealPlanNoteList,
  MealPlanNoteSchemaContextProvider
);
