import { DistributiveOmit } from "@mui/types";
import { ObjectEntity } from "../ObjectEntityType";

export interface LookupEntity extends DistributiveOmit<ObjectEntity, "id"> {
  id?: number | string | undefined;
  name: string;
  keyword?: string;
}
export interface LookupEntityFilter extends DistributiveOmit<LookupEntity, "id"> {}
