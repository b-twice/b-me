import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
  MultiSelectFieldSchema,
  SwitchFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { FoodProduct, FoodCategory, Supermarket } from "../common/client";
import {
  FoodProductApi,
  FoodCategoryApi,
  SupermarketApi,
  FoodUnitApi,
  FoodQuantityTypeApi,
} from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";

export interface FoodProductFilter
  extends Omit<FoodProduct, "foodCategory" | "supermarket"> {
  foodCategory: FoodCategory[];
  supermarket: Supermarket[];
}

export interface FoodProductsTableConfig
  extends Omit<SchemaTableConfig, "filter"> {
  filter: FoodProductFilter;
}

const FoodProductSchemaContext = React.createContext(
  {} as EditSchemaContextProps<FoodProduct | FoodProductFilter>
);

const propertyOf = (e: keyof FoodProduct) => e;

function FoodProductSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [supermarkets, setSupermarkets] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [foodQuantityTypes, setFoodQuantityTypes] = useState<FormOptionType[]>(
    []
  );
  const [foodUnits, setFoodUnits] = useState<FormOptionType[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
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

  const schema = {
    title: "",
    properties: {
      [propertyOf("name")]: {
        title: "Name",
        type: "text",
        required: true,
      } as TextFieldSchema,
      [propertyOf("supermarket")]: {
        title: "Supermarket",
        type: "select",
        options: supermarkets,
        required: false,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("foodCategory")]: {
        title: "Category",
        type: "select",
        options: categories,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("foodQuantityType")]: {
        title: "Quantity Type",
        type: "select",
        options: foodQuantityTypes,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("foodUnit")]: {
        title: "Unit",
        type: "select",
        options: foodUnits,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("dirty")]: {
        title: "Dirty",
        type: "switch",
        required: false,
      } as SwitchFieldSchema,
      [propertyOf("measurement")]: {
        title: "Measurement",
        type: "text",
        required: false,
      } as TextFieldSchema,
    },
    object: {} as FoodProduct,
  } as FormSchema<FoodProduct>;

  const filterSchema = {
    title: "Filter FoodProducts",
    properties: {
      [propertyOf("name")]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      [propertyOf("supermarket")]: {
        title: "Supermarket",
        type: "multiselect",
        options: supermarkets,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      [propertyOf("foodCategory")]: {
        title: "Category",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: {
      name: "",
      supermarket: [],
      foodCategory: [],
    } as FoodProductFilter,
    type: "FILTER",
    save: (book: FoodProduct) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<FoodProductFilter>;

  const add = (o: FoodProduct) => FoodProductApi.create(o);
  const save = (o: FoodProduct) => FoodProductApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Product",
            save: add,
          } as FormSchema<FoodProduct>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Product",
            save: save,
          } as FormSchema<FoodProduct>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Products",
          } as FormSchema<FoodProductFilter>;
      }
    },
  } as EditSchemaContextProps<FoodProduct | FoodProductFilter>;

  return (
    <FoodProductSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </FoodProductSchemaContext.Provider>
  );
}

export { FoodProductSchemaContext, FoodProductSchemaContextProvider };
