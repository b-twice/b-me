import React, { useContext, useState, useEffect } from "react";
import {
  MealPlanSchemaContext,
  MealPlanSchemaContextProvider,
  MealPlanFilter,
} from "./schemas/MealPlanSchemaContext";
import { MealPlan } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { MealPlanApi } from "../common/client/FoodApi";

function MealPlans() {
  const schemaContext = useContext(MealPlanSchemaContext);

  const [page, setPage] = useState<PaginatedResult<MealPlan>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(
    createSchemaTableConfig<MealPlanFilter>()
  );

  useEffect(() => {
    MealPlanApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.name,
      config.filter?.users,
      config.filter?.recipes,
      config.filter?.years,
      config.filter?.months
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj: MealPlanFilter | undefined) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <>
      <SchemaTable<MealPlan, MealPlanFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        config={config}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(MealPlans, MealPlanSchemaContextProvider);
