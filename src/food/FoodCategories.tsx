import { FoodCategoryApi } from "../common/client/FoodApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  FoodCategorySchemaContextProvider,
  FoodCategorySchemaContext,
} from "./schemas/FoodCategorySchemaContext";

export default withProvider(
  LookupTable,
  FoodCategorySchemaContextProvider,
  FoodCategorySchemaContext,
  FoodCategoryApi
);
