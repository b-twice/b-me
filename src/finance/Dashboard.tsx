import React, { useState } from "react";
import { Grid } from "@mui/material";
import FinanceSummaryCard from "./SummaryCard";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import FormYearOptions from "../core/components/forms/FormYearOptions";
import { SelectMenuFieldSchema } from "../core/components/forms/SchemaForm";
import SchemaFormField from "../core/components/forms/fields/SchemaField";
import FinanceSpendingCard from "./SpendingCard";
import FinanceMonthlySpendingSummaryCard from "./MonthlySpendingSummaryCard";
import moment from "moment";
import { styled } from "@mui/system";

const YearMenu = styled("div")({
  position: "fixed",
  bottom: "10px",
  right: "10px",
  backgroundColor: "rgba(255, 255, 255, 1)",
  zIndex: 999,
});

const formSchema = {
  year: {
    title: "Year",
    type: "select-menu",
    options: FormYearOptions,
    required: true,
    getVal: getLookupName,
  } as SelectMenuFieldSchema,
};

function FinanceDashboard() {
  const currentYear = (+moment().format("YYYY") - 1).toString();

  const [form, setForm] = useState<{ [key: string]: any }>({
    year: { id: currentYear, name: currentYear },
  });

  const onFormChange = (obj: { [key: string]: any }) => setForm({ ...obj });

  return (
    <>
      <YearMenu>
        <SchemaFormField
          property={"year"}
          obj={form}
          schema={formSchema.year}
          onChange={onFormChange}
          error={""}
        />
      </YearMenu>

      <Grid container direction="row">
        <Grid item xs={10}>
          <Grid container spacing={3}>
            <Grid item>
              <FinanceSummaryCard year={form.year.id} />
            </Grid>
            <Grid item>
              <FinanceSpendingCard year={form.year.id} />
            </Grid>
            <Grid item>
              <FinanceMonthlySpendingSummaryCard year={form.year.id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default FinanceDashboard;
