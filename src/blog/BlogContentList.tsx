import { Fragment, useContext, useEffect, useState } from "react";
import { PostGroup } from "../common/client";
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
          title={g.name!}
          links={g.posts as { path: string; title: string }[]}
        />
      ))}
    </Fragment>
  );
}

export default BlogContentList;
