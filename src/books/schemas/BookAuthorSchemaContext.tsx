import React from "react";
import { BookAuthor } from "../../common/client";
import { BookAuthorApi } from "../../common/client/BookApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";

const BookAuthorSchemaContext = React.createContext(
  {} as TableSchemaContextProps<BookAuthor>
);

function BookAuthorSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Book Authors",
    BookAuthorApi
  );
  return (
    <BookAuthorSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </BookAuthorSchemaContext.Provider>
  );
}

export { BookAuthorSchemaContext, BookAuthorSchemaContextProvider };
