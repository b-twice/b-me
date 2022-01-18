import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { TransactionRecord, TransactionRecordTag } from "../../common/client";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import {
  TransactionApi,
  BankApi,
  TransactionCategoryApi,
  TransactionTagApi,
} from "../../common/client/FinanceApi";
import { UserApi } from "../../common/client/AdminApi";
import FormYearOptions from "../../core/components/forms/FormYearOptions";
import FormMonthOptions from "../../core/components/forms/FormMonthOptions";
import {
  PaginatedResult,
  SchemaTableConfig,
} from "../../core/components/tables/SchemaTable";

type TransactionSchemaContext = TableSchemaContextProps<
  TransactionTableRecord,
  TransactionFilter
>;

export interface PaginatedFinanceResult
  extends PaginatedResult<TransactionTableRecord> {
  amountTotal?: number;
}
export const transactionUtility = {
  mapToTransactionRecord: (
    record: TransactionTableRecord
  ): TransactionRecord => {
    const item = { ...record };
    const transactionRecordTags: TransactionRecordTag[] = [];
    record?.tags?.forEach((tagId) => {
      var existingTag = item.transactionRecordTags?.find(
        (t) => t.tagId === tagId
      );
      transactionRecordTags.push({
        id: existingTag?.id ?? 0,
        transactionRecordId: record.id,
        tagId: tagId,
      } as TransactionRecordTag);
    });
    return {
      ...item,
      transactionRecordTags: transactionRecordTags,
    } as TransactionRecord;
  },

  mapToTransactionTableRecord: (
    record: TransactionRecord
  ): TransactionTableRecord => {
    const item = { ...record };
    const tags = record?.transactionRecordTags?.map((t) => t.tagId);
    return { ...item, tags: tags } as TransactionTableRecord;
  },
};

export interface TransactionTableRecord extends Omit<TransactionRecord, ""> {
  tags: number[];
}

export interface TransactionTableConfig
  extends SchemaTableConfig<TransactionFilter> {}

export interface TransactionFilter {
  description: string;
  banks: number[];
  categories: number[];
  tags: number[];
  users: number[];
  years: string[];
  months: string[];
}

const Context = React.createContext<TransactionSchemaContext>({} as any);

function TransactionSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [users, setUsers] = useState<FormOption[]>([]);
  const [categories, setCategories] = useState<FormOption[]>([]);
  const [banks, setBanks] = useState<FormOption[]>([]);
  const [tags, setTransactionTags] = useState<FormOption[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([
      BankApi.getAll(),
      TransactionCategoryApi.getAll(),
      UserApi.getAll(),
      TransactionTagApi.getAll(),
    ])
      .then(([banks, categories, users, tags]) => {
        setBanks(banks.map((r) => setOption(r, r.name as string, r.id)));
        setCategories(
          categories.map((r) => setOption(r, r.name as string, r.id))
        );
        setUsers(users.map((r) => setOption(r, r.name as string, r.id)));
        setTransactionTags(
          tags.map((r) => setOption(r, r.name as string, r.id))
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<TransactionTableRecord> = {
    properties: {
      date: FieldConstructor.date({
        title: "Date",
        required: true,
      }),
      amount: FieldConstructor.currency({
        title: "Amount",
        required: true,
      }),
      description: FieldConstructor.text({
        title: "Description",
        required: true,
      }),
      categoryId: FieldConstructor.select({
        title: "Category",
        options: categories,
        required: true,
        getVal: (v: number, o: TransactionTableRecord) => o.category?.name,
      }),
      bankId: FieldConstructor.select({
        title: "Bank",
        options: banks,
        getVal: (v: number, o: TransactionTableRecord) => o.bank?.name,
      }),
      userId: FieldConstructor.select({
        title: "User",
        options: users,
        getVal: (v: number, o: TransactionTableRecord) => o.user?.name,
      }),
      tags: FieldConstructor.multiSelect({
        title: "Tag(s)",
        options: tags,
        getVal: (v: number[], o: TransactionTableRecord) =>
          o.transactionRecordTags
            ?.filter((t) => v.includes(t.tagId))
            .map((t) => t.tag?.name)
            .join(", "),
      }),
    },
    create: (obj: TransactionTableRecord) =>
      TransactionApi.create(
        transactionUtility.mapToTransactionRecord(obj)
      ).then((r) => transactionUtility.mapToTransactionTableRecord(r)),
    update: (obj: TransactionTableRecord) =>
      TransactionApi.update(
        obj.id as number,
        transactionUtility.mapToTransactionRecord(obj)
      ).then((r) => transactionUtility.mapToTransactionTableRecord(r)),
    delete: (o: TransactionTableRecord) => TransactionApi.delete(o.id),
  };

  const filter: FormSchema<TransactionFilter> = {
    properties: {
      description: FieldConstructor.text({
        title: "Name",
      }),
      banks: FieldConstructor.multiSelect({
        title: "Banks",
        options: banks,
      }),
      categories: FieldConstructor.multiSelect({
        title: "Categories",
        options: categories,
      }),
      tags: FieldConstructor.multiSelect({
        title: "Tags",
        options: tags,
      }),
      users: FieldConstructor.multiSelect({
        title: "Users",
        options: users,
      }),
      years: FieldConstructor.multiSelect({
        title: "Years",
        options: FormYearOptions,
      }),
      months: FieldConstructor.multiSelect({
        title: "Months",
        options: FormMonthOptions,
      }),
    },
  };

  const schemaProps = {
    title: "Transactions",
    schema,
    filter,
  };

  return (
    <Context.Provider value={{ ...schemaProps }}>{children}</Context.Provider>
  );
}

export {
  Context as TransactionSchemaContext,
  TransactionSchemaContextProvider,
};
