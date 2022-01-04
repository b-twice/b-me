import React from "react";
import { useParams } from "react-router-dom";
import BlogContent from "./BlogContent";

const BlogContentRoute = () => {
  let params = useParams();
  console.log(params);
  return <BlogContent url={params["*"]!} />;
};
// <BlogContent url={params.match.url} />

export default BlogContentRoute;
