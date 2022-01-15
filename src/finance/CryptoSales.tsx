import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  CryptoSaleSchemaContext,
  CryptoSaleSchemaContextProvider,
} from "./schemas/CryptoSaleSchemaContext";
import { CryptoSale } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
  TableFilter,
} from "../core/components/tables/SchemaTable";
import { CryptoSaleApi } from "../common/client/CryptoApi";

function CryptoSales() {
  const schemaContext = useContext(CryptoSaleSchemaContext);

  const [page, setPage] = useState<PaginatedResult<CryptoSale>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(createSchemaTableConfig<TableFilter>());

  useEffect(() => {
    CryptoSaleApi.getPage(
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
      <SchemaTable<CryptoSale, TableFilter>
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

export default withProvider(CryptoSales, CryptoSaleSchemaContextProvider);
