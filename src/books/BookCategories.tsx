import { BookCategoryApi } from "../common/client/BookApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  BookCategorySchemaContextProvider,
  BookCategorySchemaContext,
} from "./schemas/BookCategorySchemaContext";

export default withProvider(
  LookupTable,
  BookCategorySchemaContextProvider,
  BookCategorySchemaContext,
  BookCategoryApi
);
