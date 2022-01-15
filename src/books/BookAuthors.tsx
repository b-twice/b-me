import { BookAuthorApi } from "../common/client/BookApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  BookAuthorSchemaContextProvider,
  BookAuthorSchemaContext,
} from "./schemas/BookAuthorSchemaContext";

export default withProvider(
  LookupTable,
  BookAuthorSchemaContextProvider,
  BookAuthorSchemaContext,
  BookAuthorApi
);
