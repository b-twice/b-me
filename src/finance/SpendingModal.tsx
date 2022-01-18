import React, { forwardRef, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { TransactionTotal } from "../common/client";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import TextListItem from "../core/components/lists/TextListItem";
import { styled } from "@mui/system";

import SpendingModalLineItem from "./SpendingModalLineItem";

export interface SpendingModalProps {
  category: TransactionTotal | null;
  year: string;
  // onSaveSuccess(obj:{[key:string]:any}):void;
  // saveText?: string;
  onClose(): void;
}

export interface SpendingModalRef {
  handleOpen(): void;
}

const ModalPaper = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  overflow: "auto",
}));

const SpendingModal = forwardRef(
  ({ category, year, onClose }: SpendingModalProps, ref: any) => {
    const [items, setItems] = useState<TransactionTotal[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
      if (category !== null) {
        setOpen(true);
        const getSummary = (year: string) => {
          FinanceApi.getTransactionCategoryTagTotals(year, category.name)
            .then((response) => {
              setItems(response);
              setIsLoading(false);
            })
            .catch((err) => {
              setError(`Error getting summary: ${err.message}`);
              setIsLoading(false);
            });
        };
        getSummary(year);
      } else {
        setOpen(false);
      }
    }, [category, year]);

    return (
      <Modal open={open} onClose={onClose}>
        <ModalPaper>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Typography variant="h6" flexGrow={1}>
                {category?.name}
              </Typography>
              <Button type="button" color="inherit" onClick={onClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
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
                  <SpendingModalLineItem
                    key={item.id}
                    category={category}
                    tag={item}
                    year={year}
                  />
                ))}
                {(!items || items?.length === 0) && (
                  <TextListItem
                    content={
                      <Typography variant="subtitle2" color="textPrimary">
                        No tags found.
                      </Typography>
                    }
                  />
                )}
              </List>
            </>
          )}
        </ModalPaper>
      </Modal>
    );
  }
);

export { SpendingModal };
