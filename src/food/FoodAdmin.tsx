import LinkList from "../core/components/lists/LinkList";

function FoodAdmin() {
  const links: { path: string; title: string }[] = [
    { path: "products", title: "Products" },
    { path: "cookbookAuthors", title: "Cookbook Authors" },
    { path: "cookbooks", title: "Cookbooks" },
    { path: "supermarkets", title: "Supermarkets" },
    { path: "recipeCategories", title: "Recipe Categories" },
    { path: "productCategories", title: "Product Categories" },
  ];
  return <LinkList title="Food Admin" links={links} />;
}

export default FoodAdmin;
