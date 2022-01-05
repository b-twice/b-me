import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
  MultiSelectFieldSchema,
  DateFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { MealPlan, Recipe, User } from "../common/client";
import { MealPlanApi, RecipeApi } from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";
import { UserApi } from "../common/client/AdminApi";
import FormYearOptions from "../core/components/forms/FormYearOptions";
import FormMonthOptions from "../core/components/forms/FormMonthOptions";

export interface MealPlanFilter extends Omit<MealPlan, "user"> {
  user: User[];
  recipe: Recipe[];
  year: FormOptionType[];
  month: FormOptionType[];
}

export interface MealPlansTableConfig
  extends Omit<SchemaTableConfig, "filter"> {
  filter: MealPlanFilter;
}

const MealPlanSchemaContext = React.createContext(
  {} as EditSchemaContextProps<MealPlan | MealPlanFilter>
);

const propertyOf = (e: keyof MealPlan) => e;

function MealPlanSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [users, setUsers] = useState<FormOptionType[]>([]);
  const [recipes, setRecipes] = useState<FormOptionType[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([UserApi.getAll(), RecipeApi.getAll()])
      .then(([users, recipes]) => {
        setUsers(users.map((r) => setOption(r, r.name as string, r.id)));
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
      [propertyOf("name")]: {
        title: "Name",
        type: "text",
        path: (o: MealPlan) => `/food/mealPlans/${o.id}`,
        required: true,
      } as TextFieldSchema,
      [propertyOf("user")]: {
        title: "User",
        type: "select",
        options: users,
        required: false,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("date")]: {
        title: "Date",
        type: "date",
        required: true,
      } as DateFieldSchema,
    },
    object: {} as MealPlan,
  } as FormSchema<MealPlan>;

  const filterSchema = {
    title: "Filter MealPlans",
    properties: {
      [propertyOf("name")]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      [propertyOf("user")]: {
        title: "User",
        type: "multiselect",
        options: users,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      recipe: {
        title: "Recipe",
        type: "multiselect",
        options: recipes,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      year: {
        title: "Years",
        type: "multiselect",
        required: false,
        options: FormYearOptions,
      } as MultiSelectFieldSchema,
      month: {
        title: "Months",
        type: "multiselect",
        required: false,
        options: FormMonthOptions,
      } as MultiSelectFieldSchema,
    },
    object: {
      name: "",
      user: [],
      recipe: [],
      year: [],
      month: [],
    } as MealPlanFilter,
    type: "FILTER",
    save: (o: MealPlan) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<MealPlanFilter>;

  const add = (o: MealPlan) => MealPlanApi.create(o);
  const save = (o: MealPlan) => MealPlanApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Meal Plan",
            save: add,
          } as FormSchema<MealPlan>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Meal Plan",
            save: save,
          } as FormSchema<MealPlan>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Meal Plans",
          } as FormSchema<MealPlanFilter>;
      }
    },
  } as EditSchemaContextProps<MealPlan | MealPlanFilter>;

  return (
    <MealPlanSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </MealPlanSchemaContext.Provider>
  );
}

export { MealPlanSchemaContext, MealPlanSchemaContextProvider };
