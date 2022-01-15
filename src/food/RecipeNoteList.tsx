import React, { Fragment, useContext, useEffect, useState } from "react";
import { Recipe, RecipeNote } from "../common/client";
import withProvider from "../core/components/withProvider";
import { SchemaFormStates } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  RecipeNoteSchemaContext,
  RecipeNoteSchemaContextProvider,
} from "./schemas/RecipeNoteSchemaContext";

function RecipeNoteList({ recipe }: { recipe: Recipe }) {
  const schemaContext = useContext(RecipeNoteSchemaContext);
  const [rows, setRows] = useState<RecipeNote[]>([]);

  useEffect(() => {
    const editRows: RecipeNote[] = recipe?.recipeNotes ?? [];
    setRows(editRows);
  }, [recipe]);

  function onRowEdit(state: SchemaFormStates, obj: RecipeNote): RecipeNote {
    if (state === "ADD") {
      return { ...obj, recipeId: recipe.id };
    }
    return obj;
  }

  return (
    <Fragment>
      <SchemaList<RecipeNote>
        title={schemaContext.title}
        schema={schemaContext.schema}
        rows={rows}
        onRowEdit={onRowEdit}
      />
    </Fragment>
  );
}

export default withProvider(RecipeNoteList, RecipeNoteSchemaContextProvider);
