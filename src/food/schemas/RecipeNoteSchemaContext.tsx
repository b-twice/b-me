import React from "react";
import {
  FieldConstructor,
  ListFormSchema,
} from "../../core/components/forms/SchemaForm";
import { RecipeNote } from "../../common/client";
import { ListSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseListSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";
import { RecipeNoteApi } from "../../common/client/FoodApi";
const RecipeNoteSchemaContext = React.createContext(
  {} as ListSchemaContextProps<RecipeNote>
);

function RecipeNoteSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const schema: ListFormSchema<RecipeNote> = {
    display: (o: RecipeNote) => ({ id: o.id, name: o.content }),
    properties: {
      content: FieldConstructor.text({
        title: "Note",
        required: true,
      }),
    },
  };

  const schemaProps = CreateBaseListSchemaContextProps<RecipeNote>({
    title: "Notes",
    api: RecipeNoteApi,
    schema,
  });

  return (
    <RecipeNoteSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </RecipeNoteSchemaContext.Provider>
  );
}

export { RecipeNoteSchemaContext, RecipeNoteSchemaContextProvider };
