import React, { Fragment, useContext, useEffect, useState } from "react";
import { MealPlan, MealPlanNote } from "../common/client";
import { MealPlanNoteApi } from "../common/client/FoodApi";

import withProvider from "../core/components/withProvider";
import { ListObjectEntity } from "../core/components/forms/ObjectEntityType";
import { FormSchema } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  MealPlanNoteSchemaContext,
  MealPlanNoteSchemaContextProvider,
} from "./MealPlanNoteSchemaContext";

type MealPlanNoteEdit = MealPlanNote & ListObjectEntity;

function MealPlanNoteList({ mealPlan }: { mealPlan: MealPlan }) {
  const schemaContext = useContext(MealPlanNoteSchemaContext);
  const [rows, setRows] = useState<MealPlanNoteEdit[]>([]);

  useEffect(() => {
    const editRows: MealPlanNoteEdit[] = (mealPlan?.mealPlanNotes ?? []).map(
      (r) => setNewRow(r as MealPlanNoteEdit)
    );
    setRows(editRows);
  }, [mealPlan]);

  const setNewRow = (r: MealPlanNoteEdit) =>
    ({
      ...r,
      name: r.content,
    } as MealPlanNoteEdit);

  const handleDelete = (mr: MealPlanNoteEdit) => MealPlanNoteApi.delete(mr.id!);

  function getEntitySchema(obj?: MealPlanNoteEdit) {
    return obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: { ...obj, mealPlan: { ...mealPlan } },
        }) as FormSchema<MealPlanNoteEdit>)
      : (schemaContext.get({
          type: "ADD",
          obj: { mealPlanId: mealPlan?.id, mealPlan: { ...mealPlan } },
        }) as FormSchema<MealPlanNoteEdit>);
  }

  return (
    <Fragment>
      <SchemaList
        title="Notes"
        getEntitySchema={getEntitySchema}
        rows={rows}
        setNewRow={setNewRow}
        deleteEntity={handleDelete}
      />
    </Fragment>
  );
}

export default withProvider(
  MealPlanNoteList,
  MealPlanNoteSchemaContextProvider
);
