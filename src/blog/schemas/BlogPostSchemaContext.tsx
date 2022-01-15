import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../../core/components/forms/SchemaForm";
import FormOption from "../../core/components/forms/FormOptionType";
import { Post } from "../../common/client";
import { BlogPostApi } from "../../common/client/BlogPostApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateBaseSchemaContextProps } from "../../core/components/forms/BaseSchemaProps";

export interface PostFilter {
  title: string;
  description: string;
  groups: number[];
}

const BlogPostSchemaContext = React.createContext(
  {} as TableSchemaContextProps<Post, PostFilter>
);

function BlogPostSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [groups, setGroups] = useState<FormOption[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOption);
    Promise.all([BlogPostApi.getGroups()])
      .then(([groups]) => {
        setGroups(groups.map((r) => setOption(r, r.name as string, r.id)));
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema: FormSchema<Post> = {
    properties: {
      postGroupId: FieldConstructor.select({
        title: "Group",
        options: groups,
        required: true,
        getVal: (v: number, o: Post) => o.postGroup?.name,
      }),
      title: FieldConstructor.text({
        title: "Title",
        required: true,
      }),
      path: FieldConstructor.text({
        title: "Path",
        helperText: "e.g. notes/links",
        required: true,
      }),
      date: FieldConstructor.date({
        title: "Date",
        required: true,
      }),
      authenticate: FieldConstructor.switch({
        title: "Authenticated",
      }),
      star: FieldConstructor.switch({
        title: "Starred",
      }),
    },
  };

  const filter: FormSchema<PostFilter> = {
    properties: {
      title: FieldConstructor.text({
        title: "Title",
      }),
      description: FieldConstructor.text({
        title: "Description",
      }),
      groups: FieldConstructor.multiSelect({
        title: "Group",
        options: groups,
      }),
    },
  };

  const schemaProps = CreateBaseSchemaContextProps<Post, PostFilter>({
    title: "Posts",
    api: BlogPostApi,
    schema,
    filter,
  });

  return (
    <BlogPostSchemaContext.Provider value={{ ...schemaProps }}>
      {children}
    </BlogPostSchemaContext.Provider>
  );
}

export { BlogPostSchemaContext, BlogPostSchemaContextProvider };
