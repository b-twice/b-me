import { CookbookAuthorApi } from "../common/client/FoodApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  CookbookAuthorSchemaContextProvider,
  CookbookAuthorSchemaContext,
} from "./schemas/CookbookAuthorSchemaContext";

export default withProvider(
  LookupTable,
  CookbookAuthorSchemaContextProvider,
  CookbookAuthorSchemaContext,
  CookbookAuthorApi
);
