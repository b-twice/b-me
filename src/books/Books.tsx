import React, { useContext, useState, useEffect } from "react";
import {
  BookSchemaContext,
  BookSchemaContextProvider,
  BookFilter,
} from "./schemas/BookSchemaContext";
import { Book } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { BookApi } from "../common/client/BookApi";

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const [page, setPage] = useState<PaginatedResult<Book>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(createSchemaTableConfig<BookFilter>());

  useEffect(() => {
    BookApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.name,
      config.filter?.bookAuthors,
      config.filter?.bookCategories,
      config.filter?.bookStatuses,
      config.filter?.readYears
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj?: BookFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <>
      <SchemaTable<Book, BookFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        config={config}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
