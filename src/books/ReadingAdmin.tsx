import LinkList from "../core/components/lists/LinkList";

function ReadingAdmin() {
  const links: { path: string; title: string }[] = [
    { path: "authors", title: "Authors" },
    { path: "categories", title: "Categories" },
    { path: "statuses", title: "Statuses" },
  ];
  return <LinkList title="Reading Admin" links={links} />;
}

export default ReadingAdmin;
