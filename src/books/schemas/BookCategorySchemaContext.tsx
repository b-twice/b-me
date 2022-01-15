import React from "react";
import { BookCategory } from "../../common/client";
import { BookCategoryApi } from "../../common/client/BookApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";

const BookCategorySchemaContext = React.createContext(
  {} as TableSchemaContextProps<BookCategory>
);

function BookCategorySchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Book Categories",
    BookCategoryApi
  );
  return (
    <BookCategorySchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </BookCategorySchemaContext.Provider>
  );
}

export { BookCategorySchemaContext, BookCategorySchemaContextProvider };
