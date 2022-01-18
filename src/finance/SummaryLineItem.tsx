import React, { useState, Fragment } from "react";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import TextListItem from "../core/components/lists/TextListItem";

interface FinancialSummaryLineItemProps {
  title: string;
  amount: number;
  children: JSX.Element[] | JSX.Element;
}

function FinancialSummaryLineItem({
  title,
  amount,
  children,
}: FinancialSummaryLineItemProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  return (
    <>
      <TextListItem
        onClick={handleClick}
        button
        content={
          <Typography variant="subtitle2" color="textPrimary">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              spacing={0}
            >
              <Grid item>{title}</Grid>
              <Grid item>{currencyFormatter.format(amount)}</Grid>
            </Grid>
          </Typography>
        }
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
}

export default FinancialSummaryLineItem;
