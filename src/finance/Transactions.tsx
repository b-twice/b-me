import React, { useContext, useState, useMemo, useCallback } from "react";
import {
  TransactionSchemaContext,
  TransactionFilter,
  TransactionSchemaContextProvider,
  transactionUtility,
  TransactionTableRecord,
} from "./schemas/TransactionSchemaContext";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FinanceApi, TransactionApi } from "../common/client/FinanceApi";
import {
  FieldConstructor,
  FormSchema,
  MultiSelectFieldSchema,
} from "../core/components/forms/SchemaForm";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import { styled } from "@mui/system";

const DisplayTotal = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
});

function Transactions() {
  const schemaContext = useContext(TransactionSchemaContext);

  const [amountTotal, setAmountTotal] = useState<number | undefined>();
  const configOptions = useMemo<Partial<SchemaTableConfig<TransactionFilter>>>(
    () => ({ sort: "date_desc", orderBy: "date" }),
    []
  );

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<TransactionFilter>) => {
      const page = await TransactionApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        true,
        config.filter?.description,
        config.filter?.banks,
        config.filter?.users,
        config.filter?.categories,
        config.filter?.tags,
        config.filter?.years,
        config.filter?.months
      );
      const items: PaginatedResult<TransactionTableRecord> = {
        ...page,
        items: page?.items?.map((i) =>
          transactionUtility.mapToTransactionTableRecord(i)
        ),
      };
      setAmountTotal(page.amountTotal);
      return items;
    },
    []
  );

  async function handleOnChange(
    schema: FormSchema<TransactionTableRecord>,
    obj: TransactionTableRecord,
    changeObj: Partial<TransactionTableRecord>
  ): Promise<FormSchema<TransactionTableRecord> | undefined> {
    if (changeObj.categoryId) {
      const tagCounts = await FinanceApi.getFrequentCategoryTags(
        changeObj.categoryId
      );
      const tagNames = tagCounts
        .sort((a, b) => ((a?.count || 0) > (b?.count || 0) ? 1 : -1))
        .map((o) => o.name);
      let newSchema: FormSchema<TransactionTableRecord> = {
        ...schema,
        properties: {
          ...schema.properties,
          tags: FieldConstructor.multiSelect({
            ...(schema.properties.tags as MultiSelectFieldSchema),
            helperText: `Suggested tags: ${tagNames.join(", ")}`,
          }),
        },
      };
      return newSchema;
    }
    return undefined;
  }

  return (
    <>
      <DisplayTotal>
        <strong>Total:</strong> {currencyFormatter.format(amountTotal ?? 0)}
      </DisplayTotal>
      <SchemaTable<TransactionTableRecord, TransactionFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        onChange={handleOnChange}
        configOptions={configOptions}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Transactions, TransactionSchemaContextProvider);
