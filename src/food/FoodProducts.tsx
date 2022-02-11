import React, { useCallback, useContext } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import {
  FoodProductSchemaContextProvider,
  FoodProductSchemaContext,
  FoodProductFilter,
} from "./schemas/FoodProductSchemaContext";
import { FoodProduct } from "../common/client";
import { FoodProductApi, FoodQuantityTypeApi } from "../common/client/FoodApi";
import {
  FieldConstructor,
  FormSchema,
  SelectFieldSchema,
} from "../core/components/forms/SchemaForm";

function FoodProducts() {
  const schemaContext = useContext(FoodProductSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<FoodProductFilter>) =>
      await FoodProductApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.name,
        config.filter?.foodCategories,
        config.filter?.supermarkets
      ),
    []
  );

  const handleOnChange = async (
    schema: FormSchema<FoodProduct>,
    obj: FoodProduct,
    changeObj: Partial<FoodProduct>
  ): Promise<FormSchema<FoodProduct> | undefined> => {
    if (changeObj.foodQuantityTypeId) {
      const { name } = await FoodQuantityTypeApi.get(
        changeObj.foodQuantityTypeId
      );
      let newSchema: FormSchema<FoodProduct> = {
        ...schema,
        properties: {
          ...schema.properties,
          foodUnitId: FieldConstructor.select({
            ...(schema.properties.foodUnitId as SelectFieldSchema),
            required: name === "Weight",
            visible: name === "Weight",
          }),
        },
      };
      return newSchema;
    }
    return undefined;
  };

  return (
    <>
      <SchemaTable<FoodProduct, FoodProductFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
        onChange={handleOnChange}
      />
    </>
  );
}

export default withProvider(FoodProducts, FoodProductSchemaContextProvider);
