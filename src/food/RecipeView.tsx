import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FoodProduct, Recipe, RecipeIngredient } from "../common/client";
import {
  FoodQuantityTypeApi,
  FoodUnitApi,
  RecipeApi,
  RecipeIngredientApi,
} from "../common/client/FoodApi";

import withProvider from "../core/components/withProvider";
import { ListObjectEntity } from "../core/components/forms/ObjectEntityType";
import { FormSchema } from "../core/components/forms/SchemaForm";
import SchemaList from "../core/components/lists/SchemaList";
import {
  RecipeIngredientSchemaContext,
  RecipeIngredientSchemaContextProvider,
} from "./RecipeIngredientSchemaConext";
import { Link } from "@material-ui/core";

type RecipeIngredientEdit = RecipeIngredient & ListObjectEntity;

function RecipeView() {
  const propertyOfRecipeIngredient = (e: keyof RecipeIngredient) => e;

  const schemaContext = useContext(RecipeIngredientSchemaContext);
  const params = useParams() as any;
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [rows, setRows] = useState<RecipeIngredientEdit[]>([]);
  useEffect(() => {
    RecipeApi.get(params.recipeId).then((result) => setRecipe(result));
  }, [params]);
  useEffect(() => {
    const editRows: RecipeIngredientEdit[] = (
      recipe?.recipeIngredients ?? []
    ).map((r) => setNewRow(r as RecipeIngredientEdit));
    setRows(editRows);
  }, [recipe]);

  const setNewRow = (r: RecipeIngredientEdit) =>
    ({
      ...r,
      name: `${r.measurement} ${r.foodProduct?.name}`,
    } as RecipeIngredientEdit);

  const handleDelete = (mr: RecipeIngredientEdit) =>
    RecipeIngredientApi.delete(mr.id!);

  function getEntitySchema(obj?: RecipeIngredientEdit) {
    return obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: { ...obj, recipe: { ...recipe } },
        }) as FormSchema<RecipeIngredientEdit>)
      : (schemaContext.get({
          type: "ADD",
          obj: { recipeId: recipe?.id, recipe: { ...recipe } },
        }) as FormSchema<RecipeIngredientEdit>);
  }

  const addSuggestedQuantityToSchema = (
    schema: FormSchema<ListObjectEntity>,
    product: FoodProduct,
    obj: { [key: string]: any }
  ): Promise<FormSchema<ListObjectEntity>> => {
    return Promise.all([
      FoodQuantityTypeApi.get(product.foodQuantityTypeId!),
      FoodUnitApi.get(product.foodUnitId!),
    ]).then(
      ([quantity, unit]) =>
        new Promise((resolve) => {
          let newSchema = {
            ...schema,
            object: obj,
            properties: {
              ...schema.properties,
              [propertyOfRecipeIngredient("foodProduct")]: {
                ...schema.properties[propertyOfRecipeIngredient("foodProduct")],
                helperText: `By ${quantity.name}`,
              },
              [propertyOfRecipeIngredient("weight")]: {
                ...schema.properties[propertyOfRecipeIngredient("weight")],
                disabled: quantity.name !== "Weight",
                helperText: quantity.name === "Weight" ? `${unit.name}` : "",
              },
            },
          } as FormSchema<ListObjectEntity>;
          resolve(newSchema);
        })
    );
  };

  const handleOnChange = (
    schema: FormSchema<ListObjectEntity>,
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): Promise<FormSchema<ListObjectEntity> | undefined> => {
    if (changeObj[propertyOfRecipeIngredient("foodProduct")]) {
      return addSuggestedQuantityToSchema(
        schema,
        changeObj[propertyOfRecipeIngredient("foodProduct")],
        obj
      ).then(
        (newSchema) =>
          new Promise((resolve) => {
            resolve(newSchema);
          })
      );
    }
    return new Promise((resolve) => resolve(undefined));
  };
  return (
    <Fragment>
      {recipe?.url && (
        <Link color="secondary" href={recipe?.url}>
          <h1>{recipe?.name}</h1>
        </Link>
      )}
      {!recipe?.url && <h1>{recipe?.name}</h1>}
      <SchemaList
        title="Ingredients"
        getEntitySchema={getEntitySchema}
        rows={rows}
        setNewRow={setNewRow}
        onChange={handleOnChange}
        deleteEntity={handleDelete}
      />
    </Fragment>
  );
}

export default withProvider(RecipeView, RecipeIngredientSchemaContextProvider);
