import React from "react";
import { BookStatus } from "../../common/client";
import { BookStatusApi } from "../../common/client/BookApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";

const BookStatusSchemaContext = React.createContext(
  {} as TableSchemaContextProps<BookStatus>
);

function BookStatusSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Book Statuses",
    BookStatusApi
  );
  return (
    <BookStatusSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </BookStatusSchemaContext.Provider>
  );
}

export { BookStatusSchemaContext, BookStatusSchemaContextProvider };
