import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  NumberFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { MealPlanRecipe } from "../common/client";
import {
  MealPlanApi,
  MealPlanRecipeApi,
  RecipeApi,
} from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import getLookupName from "../core/components/forms/lookups/getLookupName";

const MealPlanRecipeSchemaContext = React.createContext(
  {} as EditSchemaContextProps<MealPlanRecipe>
);

const propertyOf = (e: keyof MealPlanRecipe) => e;

function MealPlanRecipeSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [mealPlans, setMealPlans] = useState<FormOptionType[]>([]);
  const [recipes, setRecipes] = useState<FormOptionType[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([MealPlanApi.getAll(), RecipeApi.getAll()])
      .then(([mealPlans, recipes]) => {
        setMealPlans(
          mealPlans.map((r) => setOption(r, r.name as string, r.id))
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
      [propertyOf("mealPlan")]: {
        title: "Meal Plan",
        type: "select",
        options: mealPlans,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("recipe")]: {
        title: "Recipe",
        type: "select",
        options: recipes,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("count")]: {
        title: "Count",
        type: "number",
        required: false,
      } as NumberFieldSchema,
    },
    object: {} as MealPlanRecipe,
  } as FormSchema<MealPlanRecipe>;

  const add = (o: MealPlanRecipe) =>
    MealPlanRecipeApi.create({
      ...o,
      mealPlanId: o.mealPlan?.id,
      recipeId: o.recipe?.id,
    });
  const save = (o: MealPlanRecipe) =>
    MealPlanRecipeApi.update(o.id as number, {
      ...o,
      mealPlanId: o.mealPlan?.id,
      recipeId: o.recipe?.id,
    });

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: action.obj ? action.obj : {},
            type: "ADD",
            title: "New Meal Plan Recipe",
            save: add,
          } as FormSchema<MealPlanRecipe>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Meal Plan Recipe",
            save: save,
          } as FormSchema<MealPlanRecipe>;
      }
    },
  } as EditSchemaContextProps<MealPlanRecipe>;

  return (
    <MealPlanRecipeSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </MealPlanRecipeSchemaContext.Provider>
  );
}

export { MealPlanRecipeSchemaContext, MealPlanRecipeSchemaContextProvider };
