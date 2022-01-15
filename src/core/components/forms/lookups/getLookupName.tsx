import FormOption from "../FormOptionType";

export default function getLookupName(value: FormOption | FormOption[] | null) {
  if (Array.isArray(value)) {
    return value?.map((v) => v.name).join(", ");
  } else {
    return value?.name;
  }
}
