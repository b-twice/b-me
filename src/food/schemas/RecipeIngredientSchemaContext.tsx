import React, { useEffect, useState } from "react";
import {
  FieldConstructor,
  ListFormSchema,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { RecipeIngredient } from "../../common/client";
import {
  RecipeIngredientApi,
  FoodProductApi,
} from "../../common/client/FoodApi";
import { ListSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseListSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

const RecipeIngredientSchemaContext = React.createContext(
  {} as ListSchemaContextProps<RecipeIngredient>
);

function RecipeIngredientSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [ingredients, setIngredients] = useState<FormOption[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([FoodProductApi.getAll()])
      .then(([ingredients]) => {
        setIngredients(
          ingredients.map((r) => setOption(r, r.name as string, r.id))
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: ListFormSchema<RecipeIngredient> = {
    repeatAdd: true,
    display: (o: RecipeIngredient) => ({
      id: o.id,
      name: `${o.measurement} ${o.foodProduct?.name}`,
    }),
    properties: {
      foodProductId: FieldConstructor.select({
        title: "Ingredient",
        options: ingredients,
        required: true,
      }),
      count: FieldConstructor.number({
        title: "Count",
        required: true,
        visible: false,
        sortable: false,
      }),
      weight: FieldConstructor.number({
        title: "Weight",
        required: true,
        visible: false,
        sortable: false,
      }),
      measurement: FieldConstructor.text({
        title: "Measurement",
        required: true,
      }),
    },
  };

  const schemaProps = CreateBaseListSchemaContextProps<RecipeIngredient>({
    title: "Ingredients",
    api: RecipeIngredientApi,
    schema,
  });

  return (
    <RecipeIngredientSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </RecipeIngredientSchemaContext.Provider>
  );
}

export { RecipeIngredientSchemaContext, RecipeIngredientSchemaContextProvider };
