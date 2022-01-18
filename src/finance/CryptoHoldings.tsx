import React, { useCallback, useContext } from "react";
import {
  CryptoHoldingSchemaContext,
  CryptoHoldingSchemaContextProvider,
} from "./schemas/CryptoHoldingSchemaContext";
import { CryptoHolding } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
  TableFilter,
} from "../core/components/tables/SchemaTable";
import { CryptoHoldingApi } from "../common/client/CryptoApi";

function CryptoHoldings() {
  const schemaContext = useContext(CryptoHoldingSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<TableFilter>) =>
      await CryptoHoldingApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage
      ),
    []
  );

  return (
    <>
      <SchemaTable<CryptoHolding, TableFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(CryptoHoldings, CryptoHoldingSchemaContextProvider);
