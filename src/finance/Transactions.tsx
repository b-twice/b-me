import React, { useContext, useState, useEffect } from "react";
import {
  TransactionSchemaContext,
  TransactionFilter,
  TransactionSchemaContextProvider,
  TransactionTableConfig,
  transactionUtility,
  TransactionTableRecord,
  PaginatedFinanceResult,
} from "./schemas/TransactionSchemaContext";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  createSchemaTableConfig,
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

  const [page, setPage] = useState<PaginatedFinanceResult>({
    items: [],
    count: 0,
    amountTotal: 0,
  });
  const [config, setConfig] = useState<TransactionTableConfig>({
    ...createSchemaTableConfig<TransactionFilter>(),
    sort: "date_desc",
    orderBy: "date",
  });

  useEffect(() => {
    TransactionApi.getPage(
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
    ).then((result) =>
      setPage({
        ...result,
        items: result?.items?.map((i) =>
          transactionUtility.mapToTransactionTableRecord(i)
        ),
      })
    );
  }, [config]);

  const handleOnFilter = (obj?: TransactionFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  const addSuggestedTagsToSchema = (
    schema: FormSchema<TransactionTableRecord>,
    categoryId: number
  ): Promise<FormSchema<TransactionTableRecord>> => {
    return FinanceApi.getFrequentCategoryTags(categoryId).then(
      (tagCounts) =>
        new Promise((resolve) => {
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
          resolve(newSchema);
        })
    );
  };

  const handleOnChange = (
    schema: FormSchema<TransactionTableRecord>,
    obj: TransactionTableRecord,
    changeObj: Partial<TransactionTableRecord>
  ): Promise<FormSchema<TransactionTableRecord> | undefined> => {
    if (changeObj.categoryId) {
      return addSuggestedTagsToSchema(schema, changeObj.categoryId).then(
        (newSchema) =>
          new Promise((resolve) => {
            resolve(newSchema);
          })
      );
    }
    return new Promise((resolve) => resolve(undefined));
  };

  return (
    <>
      <DisplayTotal>
        <strong>Total:</strong>&nbsp;
        {currencyFormatter.format(page.amountTotal || 0)}
      </DisplayTotal>
      <SchemaTable<TransactionTableRecord, TransactionFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        onChange={handleOnChange}
        config={config}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Transactions, TransactionSchemaContextProvider);
