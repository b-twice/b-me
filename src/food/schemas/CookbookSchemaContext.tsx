import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { Cookbook } from "../../common/client";
import { CookbookApi, CookbookAuthorApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface CookbookFilter {
  name: string;
  cookbookAuthors: number[];
}

const CookbookSchemaContext = React.createContext(
  {} as TableSchemaContextProps<Cookbook, CookbookFilter>
);

function CookbookSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [authors, setAuthors] = useState<FormOption[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([CookbookAuthorApi.getAll()])
      .then(([users]) => {
        setAuthors(users.map((r) => setOption(r, r.name as string, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<Cookbook> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
        required: true,
      }),
      cookbookAuthorId: FieldConstructor.select({
        title: "Author",
        options: authors,
        required: true,
        getVal: (v: number, o: Cookbook) => o.cookbookAuthor?.name,
      }),
    },
  };

  const filter: FormSchema<CookbookFilter> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
      }),
      cookbookAuthors: FieldConstructor.multiSelect({
        title: "Authors",
        options: authors,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<Cookbook, CookbookFilter>({
    title: "Cookbooks",
    api: CookbookApi,
    schema,
    filter,
  });

  return (
    <CookbookSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </CookbookSchemaContext.Provider>
  );
}

export { CookbookSchemaContext, CookbookSchemaContextProvider };
