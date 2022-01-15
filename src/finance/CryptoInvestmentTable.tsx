import React, { useContext, useEffect, useState } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
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

  const [page, setPage] = useState<PaginatedResult<CryptoInvestment>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState<SchemaTableConfig<CryptoFilter>>({
    ...createSchemaTableConfig<CryptoFilter>(),
    sort: "purchaseDate_desc",
    orderBy: "purchaseDate",
  });

  useEffect(() => {
    CryptoInvestmentApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.coins,
      config.filter?.yearsSold,
      config.filter?.status
    ).then((result) => setPage({ ...result }));
  }, [config]);

  const handleOnFilter = (obj?: CryptoFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <SchemaTable<CryptoInvestment, CryptoFilter>
      filterSchema={schemaContext.filter}
      schema={schemaContext.schema}
      onFilter={handleOnFilter}
      page={page}
      onPage={setConfig}
      config={config}
      title={schemaContext.title}
    />
  );
}

export default withProvider(CryptoInvestmentTable, CryptoSchemaContextProvider);
