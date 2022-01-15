import React from "react";
import { CryptoCoin } from "../../common/client";
import { CryptoCoinApi } from "../../common/client/CryptoApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";

const CryptoCoinSchemaContext = React.createContext(
  {} as TableSchemaContextProps<CryptoCoin>
);

function CryptoCoinSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Crypto Coins",
    CryptoCoinApi
  );
  return (
    <CryptoCoinSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </CryptoCoinSchemaContext.Provider>
  );
}

export { CryptoCoinSchemaContext, CryptoCoinSchemaContextProvider };
