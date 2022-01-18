import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, List } from "@mui/material";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { TransactionTotal } from "../common/client";
import { SpendingModalRef, SpendingModal } from "./SpendingModal";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";

interface FinanceSpendingCardProps {
  year: string;
}

function FinanceSpendingCard({ year }: FinanceSpendingCardProps) {
  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedTransactionCategory, setSelectedTransactionCategory] =
    useState<TransactionTotal | null>(null);

  const modalRef = useRef<SpendingModalRef>(null);

  useEffect(() => {
    const getSummary = (year: string) => {
      FinanceApi.getTransactionCategoryTotals(year)
        .then((response) => {
          const total = response.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue?.amount || 0),
            0
          );
          setTotal(total);
          setItems(response);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(`Error getting summary: ${err.message}`);
          setIsLoading(false);
        });
    };
    getSummary(year);
  }, [year]);

  const handleModalOpen = (
    transactionCategoryTotal: TransactionTotal
  ): void => {
    setSelectedTransactionCategory(transactionCategoryTotal);
  };
  const handleModalClose = (): void => {
    setSelectedTransactionCategory(null);
  };

  return (
    <>
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography fontSize={14} color="textSecondary" gutterBottom>
            Annual Summary
          </Typography>
          {error && (
            <Typography color="error" variant="overline">
              {error}
            </Typography>
          )}
          {isLoading ? (
            <AppSpinner />
          ) : (
            <>
              <List sx={{ overflowY: "auto" }}>
                {items?.map((item) => (
                  <ButtonSplitTextListItem
                    key={item.name}
                    // sx={{ fontWeight: 400 }}
                    variant="subtitle2"
                    left={item.name}
                    right={currencyFormatter.format(item.amount || 0)}
                    handleClick={() => handleModalOpen(item)}
                  />
                ))}
                <SplitTextListItem
                  sx={{
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                    fontWeight: "bold",
                  }}
                  typography={{ variant: "subtitle2" }}
                  left="Total"
                  right={currencyFormatter.format(total)}
                />
              </List>
            </>
          )}
        </CardContent>
      </Card>
      <SpendingModal
        ref={modalRef}
        category={selectedTransactionCategory}
        year={year}
        onClose={handleModalClose}
      />
    </>
  );
}

export default FinanceSpendingCard;
