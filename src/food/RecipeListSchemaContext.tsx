import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
  MultiSelectFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import {
  Recipe,
  User,
  RecipeCategory,
  Cookbook,
  FoodProduct,
} from "../common/client";
import {
  RecipeApi,
  RecipeCategoryApi,
  CookbookApi,
  FoodProductApi,
} from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { DistributiveOmit } from "@mui/types";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";
import { UserApi } from "../common/client/AdminApi";

export interface RecipeFilter
  extends DistributiveOmit<
    Recipe,
    "user" | "recipeCategory" | "cookbook" | "recipeIngredients"
  > {
  user: User[];
  recipeCategory: RecipeCategory[];
  cookbook: Cookbook[];
  recipeIngredients: FoodProduct[];
}

export interface RecipesTableConfig extends DistributiveOmit<SchemaTableConfig, "filter"> {
  filter: RecipeFilter;
}

const RecipeSchemaContext = React.createContext(
  {} as EditSchemaContextProps<Recipe | RecipeFilter>
);

const propertyOf = (e: keyof Recipe) => e;

function RecipeSchemaContextProvider({ children }: { children: JSX.Element }) {
  const [users, setUsers] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [cookbooks, setCookbooks] = useState<FormOptionType[]>([]);
  const [products, setFoodProducts] = useState<FormOptionType[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([
      UserApi.getAll(),
      RecipeCategoryApi.getAll(),
      CookbookApi.getAll(),
      FoodProductApi.getAll(),
    ])
      .then(([users, categories, cookbooks, prod]) => {
        setUsers(users.map((r) => setOption(r, r.name as string, r.id)));
        setCategories(
          categories.map((r) => setOption(r, r.name as string, r.id))
        );
        setCookbooks(
          cookbooks.map((r) => setOption(r, r.name as string, r.id))
        );
        setFoodProducts(prod.map((r) => setOption(r, r.name as string, r.id)));
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
        path: (o: Recipe) => `/food/recipes/${o.id}`,
        required: true,
      } as TextFieldSchema,
      [propertyOf("user")]: {
        title: "User",
        type: "select",
        options: users,
        required: false,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("recipeCategory")]: {
        title: "Category",
        type: "select",
        options: categories,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("cookbook")]: {
        title: "Cookbook",
        type: "select",
        options: cookbooks,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("servings")]: {
        title: "Servings",
        type: "text",
        required: true,
      } as TextFieldSchema,
      [propertyOf("pageNumber")]: {
        title: "Page Number",
        type: "text",
        required: false,
      } as TextFieldSchema,
      [propertyOf("url")]: {
        title: "URL",
        type: "text",
        required: false,
      } as TextFieldSchema,
    },
    object: {} as Recipe,
  } as FormSchema<Recipe>;

  const filterSchema = {
    title: "Filter Recipes",
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
      [propertyOf("recipeCategory")]: {
        title: "Category",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      [propertyOf("recipeIngredients")]: {
        title: "Ingredients",
        type: "multiselect",
        options: products,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: {
      name: "",
      user: [],
      recipeCategory: [],
      cookbook: [],
      recipeIngredients: [],
    } as RecipeFilter,
    type: "FILTER",
    save: (book: Recipe) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<RecipeFilter>;

  const add = (o: Recipe) => RecipeApi.create(o);
  const save = (o: Recipe) => RecipeApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Recipe",
            save: add,
          } as FormSchema<Recipe>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Recipe",
            save: save,
          } as FormSchema<Recipe>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Recipes",
          } as FormSchema<RecipeFilter>;
      }
    },
  } as EditSchemaContextProps<Recipe | RecipeFilter>;

  return (
    <RecipeSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </RecipeSchemaContext.Provider>
  );
}

export { RecipeSchemaContext, RecipeSchemaContextProvider };
