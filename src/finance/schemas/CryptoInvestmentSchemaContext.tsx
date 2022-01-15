import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { CryptoInvestment } from "../../common/client";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import { CryptoCoinApi } from "../../common/client/CryptoApi";
import FormYearOptions from "../../core/components/forms/FormYearOptions";
import moment from "moment";
import currencyFormatter from "../../core/components/formatters/CurrencyFormatter";

type CryptoSchemaContext = TableSchemaContextProps<
  CryptoInvestmentTableRecord,
  CryptoFilter
>;

export type CryptoFilter = {
  coins: string[];
  status: string | undefined;
  yearsSold: string[];
};
export type CryptoInvestmentTableRecord = Omit<CryptoInvestment, "">;

const Context = React.createContext<CryptoSchemaContext>({} as any);

function CryptoSchemaContextProvider({ children }: { children: JSX.Element }) {
  const [coinsLookup, setCoins] = useState<FormOption[]>([]);
  const [statusLookup, setStatus] = useState<FormOption[]>([]);
  useEffect(() => {
    setStatus([
      { label: "Active", value: "Active" },
      { label: "Sold", value: "Sold" },
    ]);
    CryptoCoinApi.getAll()
      .then((coins) => {
        setCoins(
          coins?.map((r) =>
            FieldConstructor.option(r, r.name as string, r.name)
          ) || []
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<CryptoInvestmentTableRecord> = {
    readonly: true,
    properties: {
      name: FieldConstructor.text({
        title: "Coin Name",
      }),
      holdingStatus: FieldConstructor.text({
        title: "Status",
      }),
      purchaseDate: FieldConstructor.date({
        title: "Purchase Date",
        getVal: (pd: string) => moment(pd).format("YYYY-MM-DD h:mm:ss a"),
      }),
      purchasePrice: FieldConstructor.currency({
        title: "Purchase Price",
      }),
      quantity: FieldConstructor.number({
        title: "Quantity",
        sortable: false,
      }),
      purchaseValue: FieldConstructor.currency({
        title: "Purchase Value",
      }),
      marketValue: FieldConstructor.currency({
        title: "Market Value",
        getVal: (v: number) =>
          v !== null && v > 0 ? currencyFormatter.format(v) : "N/A",
      }),
      sellDate: FieldConstructor.date({
        title: "Sell Date",
        getVal: (sd: string) =>
          sd ? moment(sd).format("YYYY-MM-DD h:mm:ss a") : null,
      }),
      sellValue: FieldConstructor.currency({
        title: "Sell Value",
      }),
      sellPrice: FieldConstructor.currency({
        title: "Sell Price",
      }),
      netGain: FieldConstructor.currency({
        title: "Net Gain",
      }),
    },
  };

  const filterSchema: FormSchema<CryptoFilter> = {
    properties: {
      coins: FieldConstructor.multiSelect({
        title: "Coins",
        options: coinsLookup,
      }),
      status: FieldConstructor.multiSelect({
        title: "Status",
        options: statusLookup,
      }),
      yearsSold: FieldConstructor.multiSelect({
        title: "Sell Years",
        options: FormYearOptions,
      }),
    },
  };

  const schemaProps: CryptoSchemaContext = {
    title: "Crypto Investments",
    schema: schema,
    filter: filterSchema,
  };

  return (
    <Context.Provider value={{ ...schemaProps }}>{children}</Context.Provider>
  );
}

export { Context as CryptoSchemaContext, CryptoSchemaContextProvider };
