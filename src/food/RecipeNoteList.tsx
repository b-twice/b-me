import React, { Fragment, useContext, useEffect, useState } from "react";
import { Recipe, RecipeNote } from "../common/client";
import { RecipeNoteApi } from "../common/client/FoodApi";

import withProvider from "../core/components/withProvider";
import { ListObjectEntity } from "../core/components/forms/ObjectEntityType";
import { FormSchema } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  RecipeNoteSchemaContext,
  RecipeNoteSchemaContextProvider,
} from "./RecipeNoteSchemaContext";

type RecipeNoteEdit = RecipeNote & ListObjectEntity;

function RecipeNoteList({ recipe }: { recipe: Recipe }) {
  const schemaContext = useContext(RecipeNoteSchemaContext);
  const [rows, setRows] = useState<RecipeNoteEdit[]>([]);

  useEffect(() => {
    const editRows: RecipeNoteEdit[] = (recipe?.recipeNotes ?? []).map((r) =>
      setNewRow(r as RecipeNoteEdit)
    );
    setRows(editRows);
  }, [recipe]);

  const setNewRow = (r: RecipeNoteEdit) =>
    ({
      ...r,
      name: r.content,
    } as RecipeNoteEdit);

  const handleDelete = (mr: RecipeNoteEdit) => RecipeNoteApi.delete(mr.id!);

  function getEntitySchema(obj?: RecipeNoteEdit) {
    return obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: { ...obj, recipe: { ...recipe } },
        }) as FormSchema<RecipeNoteEdit>)
      : (schemaContext.get({
          type: "ADD",
          obj: { recipeId: recipe?.id, recipe: { ...recipe } },
        }) as FormSchema<RecipeNoteEdit>);
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

export default withProvider(RecipeNoteList, RecipeNoteSchemaContextProvider);
