import React, { useCallback, useContext } from "react";
import {
  BlogPostSchemaContext,
  BlogPostSchemaContextProvider,
  PostFilter,
} from "./schemas/BlogPostSchemaContext";
import { Post } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  SchemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { BlogPostApi } from "../common/client/BlogPostApi";

function Posts() {
  const schemaContext = useContext(BlogPostSchemaContext);

  const handleOnPage = useCallback(
    async (config: SchemaTableConfig<PostFilter>) =>
      await BlogPostApi.getPage(
        config.sort,
        config.pageNumber + 1,
        config.rowsPerPage,
        config.filter?.title,
        config.filter?.description,
        config.filter?.groups
      ),
    []
  );

  return (
    <>
      <SchemaTable<Post, PostFilter>
        filterSchema={schemaContext.filter}
        schema={schemaContext.schema}
        onPage={handleOnPage}
        title={schemaContext.title}
      />
    </>
  );
}

export default withProvider(Posts, BlogPostSchemaContextProvider);
