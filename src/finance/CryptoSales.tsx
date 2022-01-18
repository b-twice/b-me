import React, { useCallback, useContext } from "react";
import {
  CryptoSaleSchemaContext,
  CryptoSaleSchemaContextProvider,
} from "./schemas/CryptoSaleSchemaContext";
import { CryptoSale } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  TableFilter,
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { CryptoSaleApi } from "../common/client/CryptoApi";

function CryptoSales() {
  const schemaContext = useContext(CryptoSaleSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<TableFilter>) =>
      CryptoSaleApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage
      ),
    []
  );

  return (
    <>
      <SchemaTable<CryptoSale, TableFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(CryptoSales, CryptoSaleSchemaContextProvider);
