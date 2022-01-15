import { SupermarketApi } from "../common/client/FoodApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  SupermarketSchemaContextProvider,
  SupermarketSchemaContext,
} from "./schemas/SupermarketSchemaContext";

export default withProvider(
  LookupTable,
  SupermarketSchemaContextProvider,
  SupermarketSchemaContext,
  SupermarketApi
);
