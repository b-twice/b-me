import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  BlogPostSchemaContext,
  BlogPostSchemaContextProvider,
  PostFilter,
} from "./schemas/BlogPostSchemaContext";
import { Post } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  createSchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { BlogPostApi } from "../common/client/BlogPostApi";

function Posts() {
  const schemaContext = useContext(BlogPostSchemaContext);

  const [page, setPage] = useState<PaginatedResult<Post>>({
    items: [],
    count: 0,
  });
  const [config, setConfig] = useState(createSchemaTableConfig<PostFilter>());

  useEffect(() => {
    BlogPostApi.getPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter?.title,
      config.filter?.description,
      config.filter?.groups
    ).then((result) => setPage(result));
  }, [config]);

  const handleOnFilter = (obj?: PostFilter) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  return (
    <Fragment>
      <SchemaTable<Post, PostFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onFilter={handleOnFilter}
        page={page}
        onPage={setConfig}
        config={config}
        title={schemaContext.title}
      />
    </Fragment>
  );
}

export default withProvider(Posts, BlogPostSchemaContextProvider);
