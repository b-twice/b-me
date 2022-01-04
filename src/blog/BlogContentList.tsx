import { Fragment, useContext, useEffect, useState } from "react";
import { PostGroup } from "../common/client";
import { RouteItem } from "../core/components/GroupRouteLists";
import LinkList from "../core/components/lists/LinkList";
import { BlogContext } from "./BlogContext";

function BlogContentList() {
  const [groups, setGroups] = useState<PostGroup[]>([]);
  const blogContext = useContext(BlogContext);

  useEffect(() => {
    setGroups(blogContext.groups);
  }, [blogContext]);

  return (
    <Fragment>
      {groups.map((g) => (
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
    </Fragment>
  );
}

export default BlogContentList;
