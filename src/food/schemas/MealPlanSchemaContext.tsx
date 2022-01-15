import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { MealPlan } from "../../common/client";
import { MealPlanApi, RecipeApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { UserApi } from "../../common/client/AdminApi";
import FormYearOptions from "../../core/components/forms/FormYearOptions";
import FormMonthOptions from "../../core/components/forms/FormMonthOptions";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface MealPlanFilter {
  name: string;
  users: number[];
  recipes: number[];
  years: string[];
  months: string[];
}

const MealPlanSchemaContext = React.createContext(
  {} as TableSchemaContextProps<MealPlan, MealPlanFilter>
);

function MealPlanSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [users, setUsers] = useState<FormOption[]>([]);
  const [recipes, setRecipes] = useState<FormOption[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
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

  const schema: FormSchema<MealPlan> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
        path: (o: MealPlan) => `/food/mealPlans/${o.id}`,
        required: true,
      }),
      userId: FieldConstructor.select({
        title: "User",
        options: users,
        required: true,
        getVal: (v: number, o: MealPlan) => o.user?.name,
      }),
      date: FieldConstructor.date({
        title: "Date",
        required: true,
      }),
    },
  };

  const filter: FormSchema<MealPlanFilter> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
      }),
      users: FieldConstructor.multiSelect({
        title: "User",
        options: users,
      }),
      recipes: FieldConstructor.multiSelect({
        title: "Recipe",
        options: recipes,
      }),
      years: FieldConstructor.multiSelect({
        title: "Years",
        options: FormYearOptions,
      }),
      months: FieldConstructor.multiSelect({
        title: "Months",
        options: FormMonthOptions,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<MealPlan, MealPlanFilter>({
    title: "Meal Plans",
    api: MealPlanApi,
    schema,
    filter,
  });

  return (
    <MealPlanSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </MealPlanSchemaContext.Provider>
  );
}

export { MealPlanSchemaContext, MealPlanSchemaContextProvider };
