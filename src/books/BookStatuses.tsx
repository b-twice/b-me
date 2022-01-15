import { BookStatusApi } from "../common/client/BookApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  BookStatusSchemaContextProvider,
  BookStatusSchemaContext,
} from "./schemas/BookStatusSchemaContext";

export default withProvider(
  LookupTable,
  BookStatusSchemaContextProvider,
  BookStatusSchemaContext,
  BookStatusApi
);
