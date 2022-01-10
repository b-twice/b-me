import React, { Fragment, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import { TransactionTotal } from "../common/client";
import MonthlySpendingLineItem from "./MonthlySpendingLineItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
interface FinanceMonthlySpendingSummaryCardProps {
  year: string;
}

function FinanceMonthlySpendingSummaryCard({
  year,
}: FinanceMonthlySpendingSummaryCardProps) {
  const [average, setAverage] = useState<number>(0);
  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getSummary = (year: string) => {
      FinanceApi.getTransactionMonthlyTotals(year)
        .then((response) => {
          const total = response.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue?.amount || 0),
            0
          );
          setItems(response);
          setAverage(total / response.length);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(`Error getting summary: ${err.message}`);
          setIsLoading(false);
        });
    };
    getSummary(year);
  }, [year]);

  return (
    <Fragment>
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography fontSize={14} color="textSecondary" gutterBottom>
            Monthly Summary
          </Typography>
          {error && (
            <Typography color="error" variant="overline">
              {error}
            </Typography>
          )}
          {isLoading ? (
            <AppSpinner />
          ) : (
            <Fragment>
              <List sx={{ overflowY: "auto" }}>
                {items?.map((item) => (
                  <MonthlySpendingLineItem
                    key={item.name}
                    total={item}
                    year={year}
                  />
                ))}
                <SplitTextListItem
                  sx={{
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                    fontWeight: "bold",
                  }}
                  typography={{ variant: "subtitle2" }}
                  left="Average"
                  right={currencyFormatter.format(average)}
                />
              </List>
            </Fragment>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default FinanceMonthlySpendingSummaryCard;
