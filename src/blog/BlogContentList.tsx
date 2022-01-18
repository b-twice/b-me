import { useContext, useEffect, useState } from "react";
import { PostGroup } from "../common/client";
import { RouteItem } from "../core/components/GroupRouteLists";
import LinkList from "../core/components/lists/LinkList";
import { BlogContext } from "./BlogContext";

function BlogContentList() {
  const blogContext = useContext(BlogContext);

  return (
    <>
      {blogContext.groups.map((g) => (
        <LinkList
          key={g.id}
          title={g.name!}
          links={
            blogContext
              .findRoutesByGroup(g)
              .map((r) => r as RouteItem)
              .sort((a, b) =>
                a.title! > b.title! ? 1 : a.title! < b.title! ? -1 : 0
              ) as { path: string; title: string }[]
          }
        />
      ))}
    </>
  );
}

export default BlogContentList;
