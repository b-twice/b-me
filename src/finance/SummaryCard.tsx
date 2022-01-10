import React, { Fragment, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { FinancialSummary } from "../common/client";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import FinancialSummaryLineItem from "./SummaryLineItem";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { styled } from "@mui/system";

const Section = styled("div")(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

interface FinanceSummaryCardProps {
  year: string;
}

function FinanceSummaryCard({ year }: FinanceSummaryCardProps) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getSummary = (year: string) => {
      FinanceApi.getSummary(year)
        .then((summary) => {
          setSummary(summary);
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
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography fontSize={14} color="textSecondary" gutterBottom>
          Net Worth
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
            <Section>
              <Typography variant="h4" component="h5" gutterBottom>
                {summary?.netWorth &&
                  currencyFormatter.format(summary.netWorth)}
              </Typography>
            </Section>
            <Divider />
            <List>
              {summary && (
                <FinancialSummaryLineItem
                  title="Assets"
                  amount={summary.assetTotal || 0}
                >
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Savings"}
                    right={currencyFormatter.format(
                      summary?.asset?.saving || 0
                    )}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Retirement"}
                    right={currencyFormatter.format(
                      summary?.asset?.retirement || 0
                    )}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"HSA"}
                    right={currencyFormatter.format(summary?.asset?.hsa || 0)}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Home"}
                    right={currencyFormatter.format(summary?.asset?.home || 0)}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Auto"}
                    right={currencyFormatter.format(summary?.asset?.auto || 0)}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Stock"}
                    right={currencyFormatter.format(summary?.asset?.stock || 0)}
                  />
                </FinancialSummaryLineItem>
              )}
              {summary && (
                <FinancialSummaryLineItem
                  title="Debts"
                  amount={summary.debtTotal || 0}
                >
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Home"}
                    right={currencyFormatter.format(summary?.debt?.home || 0)}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Auto"}
                    right={currencyFormatter.format(summary?.debt?.auto || 0)}
                  />
                </FinancialSummaryLineItem>
              )}
              {summary && (
                <FinancialSummaryLineItem
                  title="Income"
                  amount={summary?.earnings?.gross || 0}
                >
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Taxable"}
                    right={currencyFormatter.format(
                      summary?.earnings?.taxable || 0
                    )}
                  />
                  <SplitTextListItem
                    sx={{ fontWeight: 400 }}
                    typography={{
                      variant: "subtitle2",
                    }}
                    left={"Taxed"}
                    right={currencyFormatter.format(
                      summary?.earnings?.taxed || 0
                    )}
                  />
                </FinancialSummaryLineItem>
              )}
            </List>
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
}

export default FinanceSummaryCard;
