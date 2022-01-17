import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { Recipe } from "../../common/client";
import {
  RecipeApi,
  RecipeCategoryApi,
  CookbookApi,
  FoodProductApi,
} from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { UserApi } from "../../common/client/AdminApi";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface RecipeFilter {
  name: string;
  users: number[];
  recipeCategories: number[];
  cookbooks: number[];
  recipeIngredients: number[];
}

const RecipeSchemaContext = React.createContext(
  {} as TableSchemaContextProps<Recipe, RecipeFilter>
);

function RecipeSchemaContextProvider({ children }: { children: JSX.Element }) {
  const [users, setUsers] = useState<FormOption[]>([]);
  const [categories, setCategories] = useState<FormOption[]>([]);
  const [cookbooks, setCookbooks] = useState<FormOption[]>([]);
  const [products, setFoodProducts] = useState<FormOption[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
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

  const schema: FormSchema<Recipe> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
        path: (o: Recipe) => `/food/recipes/${o.id}`,
        required: true,
      }),
      userId: FieldConstructor.select({
        title: "User",
        options: users,
        required: true,
        getVal: (v: number, o: Recipe) => o.user?.name,
      }),
      recipeCategoryId: FieldConstructor.select({
        title: "Category",
        options: categories,
        required: true,
        getVal: (v: number, o: Recipe) => o.recipeCategory?.name,
      }),
      cookbookId: FieldConstructor.select({
        title: "Cookbook",
        options: cookbooks,
        required: true,
        getVal: (v: number, o: Recipe) => o.cookbook?.name,
      }),
      servings: FieldConstructor.number({
        title: "Serv.",
        required: true,
      }),
      pageNumber: FieldConstructor.number({
        title: "Page #",
      }),
      url: FieldConstructor.text({
        title: "URL",
        path: (o: Recipe) => o.url,
        getVal: (v: number, o: Recipe) => (o.url ? "Link" : ""),
      }),
      complexity: FieldConstructor.rating({
        title: "Complexity",
        max: 3,
        icon: "star",
      }),
      rating: FieldConstructor.rating({
        title: "Rating",
        max: 5,
        icon: "favorite",
      }),
      makeCount: FieldConstructor.text({
        title: "Times Made",
        disabled: true,
      }),
      lastMade: FieldConstructor.text({
        title: "Last Made",
        disabled: true,
      }),
    },
  };

  const filter: FormSchema<RecipeFilter> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
      }),
      users: FieldConstructor.multiSelect({
        title: "User",
        options: users,
      }),
      recipeCategories: FieldConstructor.multiSelect({
        title: "Category",
        options: categories,
      }),
      cookbooks: FieldConstructor.multiSelect({
        title: "Cookbook",
        options: cookbooks,
      }),
      recipeIngredients: FieldConstructor.multiSelect({
        title: "Ingredients",
        options: products,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<Recipe, RecipeFilter>({
    title: "Recipes",
    api: RecipeApi,
    schema,
    filter,
  });
  return (
    <RecipeSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </RecipeSchemaContext.Provider>
  );
}

export { RecipeSchemaContext, RecipeSchemaContextProvider };
