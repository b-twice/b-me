import React, { useCallback, useContext } from "react";
import {
  BookSchemaContext,
  BookSchemaContextProvider,
  BookFilter,
} from "./schemas/BookSchemaContext";
import { Book } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { BookApi } from "../common/client/BookApi";

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<BookFilter>) =>
      await BookApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.bookAuthors,
        config.filter?.bookCategories,
        config.filter?.bookStatuses,
        config.filter?.readYears
      ),
    []
  );

  return (
    <>
      <SchemaTable<Book, BookFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
