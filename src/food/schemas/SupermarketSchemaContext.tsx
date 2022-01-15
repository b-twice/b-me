import React from "react";
import { Supermarket } from "../../common/client";
import { SupermarketApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";
import { TableFilter } from "../../core/components/tables/SchemaTable";

const SupermarketSchemaContext = React.createContext(
  {} as TableSchemaContextProps<Supermarket, TableFilter>
);

function SupermarketSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Supermarkets",
    SupermarketApi
  );
  return (
    <SupermarketSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </SupermarketSchemaContext.Provider>
  );
}

export { SupermarketSchemaContext, SupermarketSchemaContextProvider };
