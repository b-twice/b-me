import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  MealPlanSchemaContext,
  MealPlanSchemaContextProvider,
  MealPlanFilter,
  MealPlansTableConfig,
} from "./MealPlanSchemaContext";
import { MealPlan } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import { MealPlanApi } from "../common/client/FoodApi";

function MealPlans() {
  const schemaContext = useContext(MealPlanSchemaContext);

  const [filterSchema, setFilterSchema] = useState<FormSchema<MealPlanFilter>>(
    () => schemaContext.get({ type: "FILTER" })
  );
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<MealPlansTableConfig>({
    ...schemaTableConfig,
    filter: schemaContext.get<MealPlanFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    MealPlanApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.name,
      config.filter.user.map((b) => b.id as number),
      config.filter.recipe.map((b) => b.id as number),
      config.filter.year.map((b) => b.id),
      config.filter.month.map((b) => b.id)
    ).then((result) => setPage(result as PaginatedResult));
  }, [config]);

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({ type: "FILTER" }));
  }, [schemaContext]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as MealPlan,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) => MealPlanApi.delete(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as MealPlansTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as MealPlanFilter });
    setFilterSchema({ ...filterSchema, object: obj as MealPlanFilter });
  };

  return (
    <Fragment>
      <SchemaTable
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        getEntitySchema={handleGetEntitySchema}
        deleteEntity={handleDeleteEntity}
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Meal Plans"
      />
    </Fragment>
  );
}

export default withProvider(MealPlans, MealPlanSchemaContextProvider);
