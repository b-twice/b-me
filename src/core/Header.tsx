import React, { useContext, useState, Fragment } from "react";
import { AuthContext } from "./Auth";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppLink from "./components/AppLink";
import GroupRouteList from "./components/GroupRouteLists";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const drawerWidth = 240;

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  marginLeft: drawerWidth,
  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
  borderBottom: `1px solid ${
    theme.palette.mode === "light"
      ? "rgba(0,0,0,0.12)"
      : "rgba(255,255,255,0.12)"
  }`,
}));

const AppLogo = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "lighter",
  fontFamily: "Montserrat",
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const Sidebar = styled("nav")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    width: drawerWidth,
    flexShrink: 0,
  },
  backgroundColor: theme.palette.primary.light,
}));

const HeaderDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
  },
}));

function ElevationScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function Header() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const logout = () => authContext.logout(() => navigate("/"));

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const drawer = (
    <Fragment>
      <Toolbar />
      <List component="div" sx={{ flex: 1 }}>
        {authContext.authenticated && (
          <GroupRouteList
            title="Admin"
            onClick={handleDrawerClose}
            items={[
              { path: "admin/content", title: "Content" },
              { path: "admin/food", title: "Food" },
              { path: "admin/reading", title: "Reading" },
            ]}
            nested={true}
          />
        )}
        <AppLink to="/content" onClick={handleDrawerClose}>
          <ListItem button>
            <ListItemText
              primary="Content"
              sx={{ fontWeight: "bold" }}
              disableTypography={true}
            />
          </ListItem>
        </AppLink>

        {authContext.authenticated && (
          <GroupRouteList
            title="Finance"
            onClick={handleDrawerClose}
            items={[
              { path: "finance/dashboard", title: "Dashboard" },
              { path: "finance/transactions", title: "Transactions" },
            ]}
            nested={true}
          />
        )}
        <GroupRouteList
          title="Food"
          onClick={handleDrawerClose}
          items={[
            { path: "/food/mealPlans", title: "Meal Plans" },
            { path: "/food/recipes", title: "Recipes" },
          ]}
          nested={true}
        />
        <AppLink to="/reading" onClick={handleDrawerClose}>
          <ListItem button>
            <ListItemText
              primary="Content"
              sx={{ fontWeight: "bold" }}
              disableTypography={true}
            />
          </ListItem>
        </AppLink>
      </List>
    </Fragment>
  );

  return (
    <Fragment>
      <ElevationScroll>
        <HeaderAppBar elevation={2}>
          <Toolbar>
            <MenuIconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              size="large"
            >
              <MenuIcon />
            </MenuIconButton>
            <Typography variant="h6" flexGrow={1}>
              <AppLink to="/">
                <AppLogo>ME</AppLogo>
              </AppLink>
            </Typography>
            {authContext.authenticated ? (
              <IconButton
                onClick={logout}
                color="inherit"
                aria-label="logout"
                size="large"
              >
                <ExitToAppIcon />
              </IconButton>
            ) : (
              <AppLink to="login">
                <IconButton color="inherit" aria-label="login" size="large">
                  <AccountCircleIcon />
                </IconButton>
              </AppLink>
            )}
          </Toolbar>
        </HeaderAppBar>
      </ElevationScroll>
      <Sidebar>
        <Hidden smUp>
          <HeaderDrawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </HeaderDrawer>
        </Hidden>
        <Hidden smDown>
          <HeaderDrawer variant="permanent" open>
            {drawer}
          </HeaderDrawer>
        </Hidden>
      </Sidebar>
    </Fragment>
  );
}

export default Header;
