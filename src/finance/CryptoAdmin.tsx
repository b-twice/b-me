import LinkList from "../core/components/lists/LinkList";

function CryptoAdmin() {
  const links: { path: string; title: string }[] = [
    { path: "coins", title: "Crypto Coins" },
    { path: "holdings", title: "Crypto Holdings" },
    { path: "sales", title: "Crypto Sales" },
  ];
  return <LinkList title="Crypto Admin" links={links} />;
}

export default CryptoAdmin;
