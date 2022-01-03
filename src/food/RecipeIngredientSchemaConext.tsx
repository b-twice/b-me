import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  NumberFieldSchema,
  TextFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { RecipeIngredient } from "../common/client";
import {
  RecipeIngredientApi,
  RecipeApi,
  FoodProductApi,
} from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import getLookupName from "../core/components/forms/lookups/getLookupName";

const RecipeIngredientSchemaContext = React.createContext(
  {} as EditSchemaContextProps<RecipeIngredient>
);

const propertyOf = (e: keyof RecipeIngredient) => e;

function RecipeIngredientSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [ingredients, setIngredients] = useState<FormOptionType[]>([]);
  const [recipes, setRecipes] = useState<FormOptionType[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([RecipeApi.getAll(), FoodProductApi.getAll()])
      .then(([recipes, ingredients]) => {
        setIngredients(
          ingredients.map((r) => setOption(r, r.name as string, r.id))
        );
        setRecipes(recipes.map((r) => setOption(r, r.name as string, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema = {
    title: "",
    properties: {
      [propertyOf("recipe")]: {
        title: "Recipe",
        type: "select",
        options: recipes,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("foodProduct")]: {
        title: "Ingredient",
        type: "select",
        options: ingredients,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("count")]: {
        title: "Count",
        type: "number",
        required: false,
      } as NumberFieldSchema,
      [propertyOf("weight")]: {
        title: "Weight",
        type: "number",
        required: false,
      } as NumberFieldSchema,
      [propertyOf("measurement")]: {
        title: "Measurement",
        type: "text",
        required: false,
      } as TextFieldSchema,
    },
    object: {} as RecipeIngredient,
  } as FormSchema<RecipeIngredient>;

  const add = (o: RecipeIngredient) => RecipeIngredientApi.create(o);
  const save = (o: RecipeIngredient) =>
    RecipeIngredientApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: action.obj,
            type: "ADD",
            title: "New Recipe Ingredient",
            save: add,
          } as FormSchema<RecipeIngredient>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Recipe Ingredient",
            save: save,
          } as FormSchema<RecipeIngredient>;
      }
    },
  } as EditSchemaContextProps<RecipeIngredient>;

  return (
    <RecipeIngredientSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </RecipeIngredientSchemaContext.Provider>
  );
}

export { RecipeIngredientSchemaContext, RecipeIngredientSchemaContextProvider };
