import React, { useContext, useEffect, useState } from "react";
import { Recipe, RecipeIngredient } from "../common/client";
import withProvider from "../core/components/withProvider";
import {
  FieldConstructor,
  ListFormSchema,
  NumberFieldSchema,
  SchemaFormStates,
} from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  RecipeIngredientSchemaContext,
  RecipeIngredientSchemaContextProvider,
} from "./schemas/RecipeIngredientSchemaContext";
import { FoodProductApi } from "../common/client/FoodApi";

function RecipeIngredientList({ recipe }: { recipe: Recipe }) {
  const schemaContext = useContext(RecipeIngredientSchemaContext);
  const [rows, setRows] = useState<RecipeIngredient[]>([]);

  useEffect(() => {
    const editRows: RecipeIngredient[] = recipe?.recipeIngredients ?? [];
    setRows(editRows);
  }, [recipe]);

  function onRowEdit(
    state: SchemaFormStates,
    obj: RecipeIngredient
  ): RecipeIngredient {
    if (state === "ADD") {
      return { ...obj, recipeId: recipe.id };
    }
    return obj;
  }

  const handleOnChange = async (
    schema: ListFormSchema<RecipeIngredient>,
    obj: RecipeIngredient,
    changeObj: Partial<RecipeIngredient>
  ): Promise<ListFormSchema<RecipeIngredient> | undefined> => {
    if (changeObj.foodProductId) {
      const { foodQuantityType, measurement, foodUnit } =
        await FoodProductApi.get(changeObj.foodProductId);
      let newSchema: ListFormSchema<RecipeIngredient> = {
        ...schema,
        properties: {
          ...schema.properties,
          weight: FieldConstructor.number({
            ...(schema.properties.weight as NumberFieldSchema),
            visible: foodQuantityType?.name === "Weight",
            helperText:
              foodQuantityType?.name === "Weight"
                ? measurement || `Measured in ${foodUnit?.name}`
                : "",
          }),
          count: FieldConstructor.number({
            ...(schema.properties.count as NumberFieldSchema),
            visible: foodQuantityType?.name === "Count",
          }),
        },
      };
      return newSchema;
    }
    return undefined;
  };

  return (
    <>
      <SchemaList<RecipeIngredient>
        title={schemaContext.title}
        schema={schemaContext.schema}
        rows={rows}
        onRowEdit={onRowEdit}
        onChange={handleOnChange}
      />
    </>
  );
}

export default withProvider(
  RecipeIngredientList,
  RecipeIngredientSchemaContextProvider
);
