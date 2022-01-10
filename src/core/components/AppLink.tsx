import { NavLink, NavLinkProps } from "react-router-dom";
const LinkStyle = {
  color: "inherit",
  textDecoration: "none",
};
const LinkActiveStyle = {
  // color: theme.palette.secondary.main,
  fontWeight: 700,
};

const AppLink = (props: NavLinkProps) => {
  return (
    <NavLink
      {...props}
      style={({ isActive }) =>
        isActive ? { ...LinkStyle, ...LinkActiveStyle } : LinkStyle
      }
    />
  );
};
export default AppLink;
