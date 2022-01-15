import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  CryptoHoldingSchemaContext,
  CryptoHoldingSchemaContextProvider,
} from "./schemas/CryptoHoldingSchemaContext";
import { CryptoHolding } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
  TableFilter,
} from "../core/components/tables/SchemaTable";
import { CryptoHoldingApi } from "../common/client/CryptoApi";

function CryptoHoldings() {
  const schemaContext = useContext(CryptoHoldingSchemaContext);

  const [page, setPage] = useState<PaginatedResult<CryptoHolding>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(createSchemaTableConfig<TableFilter>());

  useEffect(() => {
    CryptoHoldingApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj?: TableFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<CryptoHolding, TableFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        config={config}
        title={schemaContext.title}
      />
    </Fragment>
  );
}

export default withProvider(CryptoHoldings, CryptoHoldingSchemaContextProvider);
