import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import { TransactionTotal, TransactionRecord } from "../common/client";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { TransactionApi } from "../common/client/FinanceApi";

interface SpendingModalLineItemProps {
  category: TransactionTotal | null;
  tag: TransactionTotal | null;
  year: string;
}

function SpendingModalLineItem({
  category,
  tag,
  year,
}: SpendingModalLineItemProps) {
  const getSummary = () => {
    TransactionApi.getPage(
      "date_desc",
      1,
      100,
      true,
      "",
      [],
      [],
      category?.id ? [category.id] : [],
      tag?.id ? [tag.id] : [0],
      [year],
      []
    ).then((result) => setItems(result?.items ? result.items : null));
  };

  const handleClick = () => {
    if (!items) {
      getSummary();
    }
    setOpen(!open);
  };

  const [items, setItems] = useState<TransactionRecord[] | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ButtonSplitTextListItem
        variant="subtitle2"
        left={tag?.name}
        right={currencyFormatter.format(tag?.amount || 0)}
        handleClick={handleClick}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items?.map((item) => (
          <SplitTextListItem
            key={item.id}
            sx={{
              fontWeight: 400,
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
            typography={{ variant: "subtitle2" }}
            left={`${item.date} - ${item.description}`}
            right={currencyFormatter.format(item.amount || 0)}
          />
        ))}
      </Collapse>
    </>
  );
}

export default SpendingModalLineItem;
