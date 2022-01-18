import React, { useCallback, useContext, useMemo } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import {
  CryptoFilter,
  CryptoSchemaContext,
  CryptoSchemaContextProvider,
} from "./schemas/CryptoInvestmentSchemaContext";
import { CryptoInvestmentApi } from "../common/client/CryptoApi";
import { CryptoInvestment } from "../common/client";

function CryptoInvestmentTable() {
  const schemaContext = useContext(CryptoSchemaContext);

  const configOptions = useMemo<Partial<SchemaTableConfig<CryptoFilter>>>(
    () => ({ sort: "purchaseDate_desc", orderBy: "purchaseDate" }),
    []
  );

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<CryptoFilter>) =>
      await CryptoInvestmentApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.coins,
        config.filter?.yearsSold,
        config.filter?.status
      ),
    []
  );

  return (
    <SchemaTable<CryptoInvestment, CryptoFilter>
      filterSchema={schemaContext.filter}
      schema={schemaContext.schema}
      onPage={handleOnPage}
      configOptions={configOptions}
      title={schemaContext.title}
    />
  );
}

export default withProvider(CryptoInvestmentTable, CryptoSchemaContextProvider);
