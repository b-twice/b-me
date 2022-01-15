import React, { useEffect, useState } from "react";
import {
  FieldConstructor,
  ListFormSchema,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { MealPlanRecipe } from "../../common/client";
import { MealPlanRecipeApi, RecipeApi } from "../../common/client/FoodApi";
import { ListSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseListSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

const MealPlanRecipeSchemaContext = React.createContext(
  {} as ListSchemaContextProps<MealPlanRecipe>
);

function MealPlanRecipeSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [recipes, setRecipes] = useState<FormOption[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([RecipeApi.getAll()])
      .then(([recipes]) => {
        setRecipes(recipes.map((r) => setOption(r, r.name as string, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: ListFormSchema<MealPlanRecipe> = {
    display: (o: MealPlanRecipe) => ({
      id: o.id,
      name: `${o.recipe?.name} (${o.count})`,
      path: `/food/recipes/${o.recipe?.id}`,
    }),
    properties: {
      recipeId: FieldConstructor.select({
        title: "Recipe",
        options: recipes,
        required: true,
      }),
      count: FieldConstructor.number({
        title: "Count",
      }),
    },
  };

  const schemaProps = CreateBaseListSchemaContextProps<MealPlanRecipe>({
    title: "Recipes",
    api: MealPlanRecipeApi,
    schema,
  });

  return (
    <MealPlanRecipeSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </MealPlanRecipeSchemaContext.Provider>
  );
}

export { MealPlanRecipeSchemaContext, MealPlanRecipeSchemaContextProvider };
