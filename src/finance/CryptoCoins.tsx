import { CryptoCoinApi } from "../common/client/CryptoApi";
import LookupTable from "../core/components/tables/LookupTable";
import withProvider from "../core/components/withProvider";
import {
  CryptoCoinSchemaContextProvider,
  CryptoCoinSchemaContext,
} from "./schemas/CryptoCoinSchemaContext";

export default withProvider(
  LookupTable,
  CryptoCoinSchemaContextProvider,
  CryptoCoinSchemaContext,
  CryptoCoinApi
);
