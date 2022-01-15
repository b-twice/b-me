import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { CryptoHolding } from "../../common/client";
import { CryptoHoldingApi, CryptoCoinApi } from "../../common/client/CryptoApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";
import moment from "moment";

const CryptoHoldingSchemaContext = React.createContext(
  {} as TableSchemaContextProps<CryptoHolding>
);

function CryptoHoldingSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [coins, setCoins] = useState<FormOption[]>([]);
  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([CryptoCoinApi.getAll()])
      .then(([coins]) => {
        setCoins(coins.map((r) => setOption(r, r.name, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<CryptoHolding> = {
    properties: {
      cryptoCoinId: FieldConstructor.select({
        title: "Coin",
        options: coins,
        required: true,
        getVal: (v: number, o: CryptoHolding) => o.cryptoCoin?.name,
      }),
      purchaseDate: FieldConstructor.datetime({
        title: "Date",
        required: true,
        getVal: (pd: string) => moment(pd).format("YYYY-MM-DD h:mm:ss a"),
      }),
      purchasePrice: FieldConstructor.currency({
        title: "Price",
        required: true,
        sortable: false,
      }),
      quantity: FieldConstructor.number({
        title: "Quantity",
        required: true,
        sortable: false,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<CryptoHolding>({
    title: "Crypto Holdings",
    api: CryptoHoldingApi,
    schema,
  });

  return (
    <CryptoHoldingSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </CryptoHoldingSchemaContext.Provider>
  );
}

export { CryptoHoldingSchemaContext, CryptoHoldingSchemaContextProvider };
