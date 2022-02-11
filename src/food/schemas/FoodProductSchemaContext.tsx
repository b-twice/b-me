import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { FoodProduct } from "../../common/client";
import {
  FoodProductApi,
  FoodCategoryApi,
  SupermarketApi,
  FoodUnitApi,
  FoodQuantityTypeApi,
} from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface FoodProductFilter {
  name: string;
  foodCategories: number[];
  supermarkets: number[];
}

const FoodProductSchemaContext = React.createContext(
  {} as TableSchemaContextProps<FoodProduct, FoodProductFilter>
);

function FoodProductSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [supermarkets, setSupermarkets] = useState<FormOption[]>([]);
  const [categories, setCategories] = useState<FormOption[]>([]);
  const [foodQuantityTypes, setFoodQuantityTypes] = useState<FormOption[]>([]);
  const [foodUnits, setFoodUnits] = useState<FormOption[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([
      FoodCategoryApi.getAll(),
      SupermarketApi.getAll(),
      FoodUnitApi.getAll(),
      FoodQuantityTypeApi.getAll(),
    ])
      .then(([categories, supermarkets, units, quantities]) => {
        setSupermarkets(
          supermarkets.map((r) => setOption(r, r.name as string, r.id))
        );
        setCategories(
          categories.map((r) => setOption(r, r.name as string, r.id))
        );
        setFoodUnits(units.map((r) => setOption(r, r.name as string, r.id)));
        setFoodQuantityTypes(
          quantities.map((r) => setOption(r, r.name as string, r.id))
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<FoodProduct> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
        required: true,
      }),
      supermarketId: FieldConstructor.select({
        title: "Supermarket",
        options: supermarkets,
        required: true,
        getVal: (v: number, o: FoodProduct) => o.supermarket?.name,
      }),
      foodCategoryId: FieldConstructor.select({
        title: "Category",
        options: categories,
        required: true,
        getVal: (v: number, o: FoodProduct) => o.foodCategory?.name,
      }),
      foodQuantityTypeId: FieldConstructor.select({
        title: "Quantity Type",
        options: foodQuantityTypes,
        required: true,
        getVal: (v: number, o: FoodProduct) => o.foodQuantityType?.name,
      }),
      foodUnitId: FieldConstructor.select({
        title: "Unit",
        options: foodUnits,
        getVal: (v: number, o: FoodProduct) => o.foodUnit?.name,
      }),
      dirty: FieldConstructor.switch({
        title: "Dirty",
      }),
      measurement: FieldConstructor.text({
        title: "Measurement",
      }),
    },
  };

  const filter: FormSchema<FoodProductFilter> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
      }),
      supermarkets: FieldConstructor.multiSelect({
        title: "Supermarket",
        options: supermarkets,
      }),
      foodCategories: FieldConstructor.multiSelect({
        title: "Category",
        options: categories,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<
    FoodProduct,
    FoodProductFilter
  >({
    title: "Products",
    api: FoodProductApi,
    schema,
    filter,
  });

  return (
    <FoodProductSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </FoodProductSchemaContext.Provider>
  );
}

export { FoodProductSchemaContext, FoodProductSchemaContextProvider };
