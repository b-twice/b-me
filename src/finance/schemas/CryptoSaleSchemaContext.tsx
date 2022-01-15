import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { CryptoSale } from "../../common/client";
import { CryptoSaleApi, CryptoHoldingApi } from "../../common/client/CryptoApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";
import moment from "moment";

const CryptoSaleSchemaContext = React.createContext(
  {} as TableSchemaContextProps<CryptoSale>
);

function CryptoSaleSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [availableHoldings, setAvailableHoldings] = useState<FormOption[]>([]);
  useEffect(() => {
    Promise.all([CryptoHoldingApi.getAvailable()])
      .then(([holdings]) => {
        setAvailableHoldings(
          holdings.map((r) => ({
            label: `${r.quantity} ${r.cryptoCoin?.name} on ${r.purchaseDate}`,
            value: r.id,
          }))
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<CryptoSale> = {
    properties: {
      cryptoHoldingId: FieldConstructor.select({
        title: "Coin",
        options: availableHoldings,
        required: true,
        getVal: (v: number, { cryptoHolding }: CryptoSale) =>
          `${cryptoHolding?.quantity} ${cryptoHolding?.cryptoCoin?.name} on ${cryptoHolding?.purchaseDate}`,
      }),
      sellDate: FieldConstructor.datetime({
        title: "Date",
        required: true,
        getVal: (pd: string) => moment(pd).format("YYYY-MM-DD h:mm:ss a"),
      }),
      price: FieldConstructor.currency({
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

  const schemaProps = CreateBaseSchemaContextProps<CryptoSale>({
    title: "Crypto Sales",
    api: CryptoSaleApi,
    schema,
  });

  return (
    <CryptoSaleSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </CryptoSaleSchemaContext.Provider>
  );
}

export { CryptoSaleSchemaContext, CryptoSaleSchemaContextProvider };
