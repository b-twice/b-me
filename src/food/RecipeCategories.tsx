import { RecipeCategoryApi } from "../common/client/FoodApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  RecipeCategorySchemaContextProvider,
  RecipeCategorySchemaContext,
} from "./schemas/RecipeCategorySchemaContext";

export default withProvider(
  LookupTable,
  RecipeCategorySchemaContextProvider,
  RecipeCategorySchemaContext,
  RecipeCategoryApi
);
