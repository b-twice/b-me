import moment from "moment";
import FormOptionType from "./FormOptionType";

const yearOptions = () => {
  const startYear = 2014;
  let currentYear = +moment().format("YYYY");
  const years = [];
  while (currentYear >= startYear) {
    years.push(currentYear);
    currentYear -= 1;
  }
  return years;
};
export default yearOptions().map(
  (year) =>
    ({ value: year.toString(), label: year.toString() } as FormOptionType)
);
