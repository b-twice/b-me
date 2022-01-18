import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import { TransactionTotal } from "../common/client";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { FinanceApi } from "../common/client/FinanceApi";
import FormMonthOptions from "../core/components/forms/FormMonthOptions";

interface MonthlySpendingLineItemProps {
  total: TransactionTotal | null;
  year: string;
}

function MonthlySpendingLineItem({
  total,
  year,
}: MonthlySpendingLineItemProps) {
  const formatMonth = (month?: string) =>
    FormMonthOptions.find((m) => m.value === total?.name)?.label;

  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [open, setOpen] = React.useState(false);

  const getSummary = () => {
    FinanceApi.getTransactionCategoryMonthlyTotals(year, total?.name).then(
      (result) => setItems(result)
    );
  };

  const handleClick = () => {
    if (!items) {
      getSummary();
    }
    setOpen(!open);
  };

  return (
    <>
      <ButtonSplitTextListItem
        variant="subtitle2"
        left={formatMonth(total?.name)}
        right={currencyFormatter.format(total?.amount || 0)}
        handleClick={handleClick}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items?.map((item) => (
          <SplitTextListItem
            key={item.name}
            sx={{ fontWeight: 400 }}
            typography={{
              variant: "subtitle2",
            }}
            left={`${item.name}`}
            right={currencyFormatter.format(item.amount || 0)}
          />
        ))}
      </Collapse>
    </>
  );
}

export default MonthlySpendingLineItem;
