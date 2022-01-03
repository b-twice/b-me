import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
  MultiSelectFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { Cookbook, CookbookAuthor } from "../common/client";
import { CookbookApi, CookbookAuthorApi } from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";

export interface CookbookFilter extends Omit<Cookbook, "cookbookAuthor"> {
  cookbookAuthor: CookbookAuthor[];
}

export interface CookbooksTableConfig
  extends Omit<SchemaTableConfig, "filter"> {
  filter: CookbookFilter;
}

const CookbookSchemaContext = React.createContext(
  {} as EditSchemaContextProps<Cookbook | CookbookFilter>
);

const propertyOf = (e: keyof Cookbook) => e;

function CookbookSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [authors, setAuthors] = useState<FormOptionType[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([CookbookAuthorApi.getAll()])
      .then(([users, categories, cookbooks]) => {
        setAuthors(users.map((r) => setOption(r, r.name as string, r.id)));
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
      [propertyOf("cookbookAuthor")]: {
        title: "Author",
        type: "select",
        options: authors,
        required: false,
        getVal: getLookupName,
      } as SelectFieldSchema,
    },
    object: {} as Cookbook,
  } as FormSchema<Cookbook>;

  const filterSchema = {
    title: "Filter Cookbooks",
    properties: {
      [propertyOf("name")]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      [propertyOf("cookbookAuthor")]: {
        title: "Authors",
        type: "multiselect",
        options: authors,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: {
      name: "",
      cookbookAuthor: [],
    } as CookbookFilter,
    type: "FILTER",
    save: (book: Cookbook) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<CookbookFilter>;

  const add = (o: Cookbook) => CookbookApi.create(o);
  const save = (o: Cookbook) => CookbookApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Cookbook",
            save: add,
          } as FormSchema<Cookbook>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Cookbook",
            save: save,
          } as FormSchema<Cookbook>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Cookbooks",
          } as FormSchema<CookbookFilter>;
      }
    },
  } as EditSchemaContextProps<Cookbook | CookbookFilter>;

  return (
    <CookbookSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </CookbookSchemaContext.Provider>
  );
}

export { CookbookSchemaContext, CookbookSchemaContextProvider };
