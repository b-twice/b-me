import React, { useEffect, useState, useMemo, useContext } from "react";
import BlogApi from "../common/client/BlogApi";
import { BlogContext } from "./BlogContext";
import { Typography, Container } from "@mui/material";
import { SwaggerException, Post } from "../common/client";
import moment from "moment";
import { styled } from "@mui/system";
const DOMPurify = require("dompurify");

const TitleContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  borderBottom: `4px double ${
    theme.palette.mode === "light"
      ? "rgba(0,0,0,0.12)"
      : "rgba(255,255,255,0.12)"
  }`,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "lighter",
  "&h3": {
    borderBottom: "none",
  },
}));

const Content = styled("div")(({ theme }) => ({
  fontFamily: "default",
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(1),
  fontSize: "16px",

  "& h2,h3,h4,h5,h6": {
    fontWeight: "medium",
  },
  //    "& h2,h3": {
  //    },
  "& h2": {
    borderBottom: "1px solid #eaecef",
    fontSize: "1.5rem",
  },
  "& h3": {
    fontSize: "1.4rem",
  },
  "& h4": {
    fontSize: "1.3rem",
  },

  "& table": {
    display: "block",
    overflow: "auto",
    width: "100%",
    "& tr": {
      backgroundColor: theme.palette.primary.main,
      borderTop: "1px solid #c6cbd1",
    },

    "& tr td, & tr th": {
      border: "1px solid #dfe2e5",
      padding: "6px 13px",
    },

    "& tbody tr:nth-child(2n)": {
      backgroundColor: theme.palette.primary.light,
    },
  },

  "& .org-dl dt": {
    fontWeight: "medium",
  },

  "& a": {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover, &:focus": {
      color: theme.palette.secondary.dark,
    },
  },

  "& .todo, & .done": {},
  "& .todo": {
    color: "#e17055",
  },
  "& .done": {
    color: "#00b894",
  },

  "& li.on": {
    opacity: 0.5,
  },

  "& .timestamp-kwd": {
    display: "none",
  },
  "& .timestamp": {},
  "& .org-src-container": {
    background: "#f6f6f6",
    overflowX: "scroll",
    padding: theme.spacing(0, 2),
    borderRadius: "0.25rem",
    margin: theme.spacing(1, 0),
  },
}));

interface BlogContentProps {
  url: string;
}

function BlogContent(props: BlogContentProps) {
  const blogContext = useContext(BlogContext);

  const [item, setItem] = useState<Post>();
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (blogContext.routes.length > 0) {
      const result = blogContext.findPostByPath(props.url);
      if (result !== undefined && url !== props.url) {
        setError(undefined);
        setItem(result);
        setUrl(props.url);
        BlogApi.get(blogContext.formatPostFilePath(result?.path!))
          .then((t) => setText(t))
          .catch((e: SwaggerException) => {
            setError(e.message);
          });
      }
    }
  }, [url, props.url, blogContext]);

  return useMemo(
    () => (
      <Container maxWidth="md">
        <TitleContainer>
          <Title variant="h3">{item && item.title}</Title>
          <Typography variant="subtitle2">
            {item && moment(item.date).format("DD MMM  YYYY")}
          </Typography>
        </TitleContainer>
        {error ? (
          <Typography color="error" variant="overline">
            Failed to load page.
          </Typography>
        ) : (
          <Content
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
          />
        )}
      </Container>
    ),
    [text, item, error]
  );
}

export default BlogContent;
