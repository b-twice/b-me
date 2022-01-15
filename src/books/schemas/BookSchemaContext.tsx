import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { Book } from "../../common/client";
import {
  BookApi,
  BookAuthorApi,
  BookStatusApi,
  BookCategoryApi,
} from "../../common/client/BookApi";
import FormYearOptions from "../../core/components/forms/FormYearOptions";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface BookFilter {
  name: string;
  bookAuthors: number[];
  bookStatuses: number[];
  bookCategories: number[];
  readYears: string[];
}

type BookSchemaContext = TableSchemaContextProps<Book, BookFilter>;

const context = React.createContext({} as BookSchemaContext);

function BookSchemaContextProvider({ children }: { children: JSX.Element }) {
  const [authors, setAuthors] = useState<FormOption[]>([]);
  const [categories, setCategories] = useState<FormOption[]>([]);
  const [statuses, setStatuses] = useState<FormOption[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([
      BookAuthorApi.getAll(),
      BookCategoryApi.getAll(),
      BookStatusApi.getAll(),
    ])
      .then(([authors, categories, statuses]) => {
        setAuthors(authors.map((r) => setOption(r, r.name as string, r.id)));
        setCategories(
          categories.map((r) => setOption(r, r.name as string, r.id))
        );
        setStatuses(statuses.map((r) => setOption(r, r.name as string, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<Book> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
        required: true,
      }),
      bookAuthorId: FieldConstructor.select({
        title: "Author",
        options: authors,
        required: true,
        getVal: (v: number, o: Book) => o.bookAuthor?.name,
      }),
      bookCategoryId: FieldConstructor.select({
        title: "Category",
        options: categories,
        required: true,
        getVal: (v: number, o: Book) => o.bookCategory?.name,
      }),
      bookStatusId: FieldConstructor.select({
        title: "Status",
        options: statuses,
        required: true,
        getVal: (v: number, o: Book) => o.bookStatus?.name,
      }),
      readDate: FieldConstructor.date({
        title: "Read Date",
        required: true,
      }),
    },
  };

  const filter: FormSchema<BookFilter> = {
    properties: {
      name: FieldConstructor.text({
        title: "Name",
      }),
      bookAuthors: FieldConstructor.multiSelect({
        title: "Author",
        options: authors,
      }),
      bookCategories: FieldConstructor.multiSelect({
        title: "Category",
        options: categories,
      }),
      bookStatuses: FieldConstructor.multiSelect({
        title: "Status",
        options: statuses,
      }),
      readYears: FieldConstructor.multiSelect({
        title: "Year Read",
        options: FormYearOptions,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<Book, BookFilter>({
    title: "Books",
    api: BookApi,
    schema,
    filter,
  });

  return (
    <context.Provider value={{ ...schemaProps }}>{children}</context.Provider>
  );
}

export { context as BookSchemaContext, BookSchemaContextProvider };
