import React from "react";
import { Supermarket } from "../common/client";
import { SupermarketApi } from "../common/client/FoodApi";
import { lookupFilterSchema } from "../core/components/forms/lookups/LookupSchema";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import {
  FormSchema,
  TextFieldSchema,
} from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";

const SupermarketSchemaContext = React.createContext(
  {} as EditSchemaContextProps<Supermarket>
);

const propertyOf = (e: keyof Supermarket) => e;

const supermarketSchema = {
  title: "",
  properties: {
    [propertyOf("name")]: {
      title: "Name",
      type: "text",
      required: true,
    } as TextFieldSchema,
    [propertyOf("code")]: {
      title: "Code",
      type: "text",
      required: true,
    } as TextFieldSchema,
  },
  object: {},
} as FormSchema<ObjectEntity>;

function SupermarketSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const add = (o: Supermarket) => SupermarketApi.create(o);
  const save = (o: Supermarket) => SupermarketApi.update(o.id as number, o);

  const contextProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...supermarketSchema,
            object: {},
            type: "ADD",
            title: "New Supermarket",
            save: add,
          };
        case "EDIT":
          return {
            ...supermarketSchema,
            object: action.obj,
            type: "EDIT",
            title: "Edit Supermarket",
            save: save,
          };
        case "FILTER":
          return {
            ...lookupFilterSchema,
            title: "Filter Supermarket",
          };
      }
    },
  } as EditSchemaContextProps<Supermarket>;

  return (
    <SupermarketSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </SupermarketSchemaContext.Provider>
  );
}

export { SupermarketSchemaContext, SupermarketSchemaContextProvider };
