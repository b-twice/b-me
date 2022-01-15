import React from "react";
import {
  FieldConstructor,
  ListFormSchema,
} from "../../core/components/forms/SchemaForm";
import { MealPlanNote } from "../../common/client";
import { ListSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseListSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";
import { MealPlanNoteApi } from "../../common/client/FoodApi";
const MealPlanNoteSchemaContext = React.createContext(
  {} as ListSchemaContextProps<MealPlanNote>
);

function MealPlanNoteSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const schema: ListFormSchema<MealPlanNote> = {
    display: (o: MealPlanNote) => ({ id: o.id, name: o.content }),
    properties: {
      content: FieldConstructor.text({
        title: "Note",
        required: true,
      }),
    },
  };

  const schemaProps = CreateBaseListSchemaContextProps<MealPlanNote>({
    title: "Notes",
    api: MealPlanNoteApi,
    schema,
  });

  return (
    <MealPlanNoteSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </MealPlanNoteSchemaContext.Provider>
  );
}

export { MealPlanNoteSchemaContext, MealPlanNoteSchemaContextProvider };
