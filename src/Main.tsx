import { Toolbar, Container, Box } from "@mui/material";
import Header from "./core/Header";
import { Outlet, Route, Routes } from "react-router";
import Home from "./core/Home";
import BlogContentRoute from "./blog/BlogContentRoute";
import Login from "./core/Login";
import Books from "./books/Books";
import BookAuthors from "./books/BookAuthors";
import BookCategories from "./books/BookCategories";
import BookStatuses from "./books/BookStatuses";
import { RequireAuth } from "./core/Auth";
import Transactions from "./finance/Transactions";
import FinanceDashboard from "./finance/Dashboard";
import CryptoInvestmentTable from "./finance/CryptoInvestmentTable";
import BlogPosts from "./blog/BlogPosts";
import CookbookAuthors from "./food/CookbookAuthors";
import Supermarkets from "./food/Supermarkets";
import FoodCategories from "./food/FoodCategories";
import RecipeCategories from "./food/RecipeCategories";
import FoodProducts from "./food/FoodProducts";
import RecipeList from "./food/RecipeList";
import Cookbooks from "./food/Cookbooks";
import MealPlans from "./food/MealPlans";
import FoodAdmin from "./food/FoodAdmin";
import ReadingAdmin from "./books/ReadingAdmin";
import MealPlanView from "./food/MealPlanView";
import RecipeView from "./food/RecipeView";
import BlogContentList from "./blog/BlogContentList";
import CryptoCoins from "./finance/CryptoCoins";
import CryptoAdmin from "./finance/CryptoAdmin";
import CryptoHoldings from "./finance/CryptoHoldings";
import CryptoSales from "./finance/CryptoSales";

function Main() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          paddingBottom: 2,
          marginBottom: 4,
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Box my={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="content" element={<Outlet />}>
                <Route path="*" element={<BlogContentRoute />} />
                <Route path="" element={<BlogContentList />} />
              </Route>

              <Route path="content" element={<BlogPosts />} />

              <Route
                path="admin"
                element={
                  <RequireAuth>
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route path="content" element={<BlogPosts />} />

                <Route path="crypto" element={<Outlet />}>
                  <Route path="coins" element={<CryptoCoins />} />
                  <Route path="holdings" element={<CryptoHoldings />} />
                  <Route path="sales" element={<CryptoSales />} />
                  <Route path="" element={<CryptoAdmin />} />
                </Route>

                <Route path="reading" element={<Outlet />}>
                  <Route path="authors" element={<BookAuthors />} />
                  <Route path="categories" element={<BookCategories />} />
                  <Route path="statuses" element={<BookStatuses />} />
                  <Route path="" element={<ReadingAdmin />} />
                </Route>

                <Route path="food" element={<Outlet />}>
                  <Route path="cookbookAuthors" element={<CookbookAuthors />} />
                  <Route path="cookbooks" element={<Cookbooks />} />
                  <Route path="supermarkets" element={<Supermarkets />} />
                  <Route
                    path="productCategories"
                    element={<FoodCategories />}
                  />
                  <Route
                    path="recipeCategories"
                    element={<RecipeCategories />}
                  />
                  <Route path="products" element={<FoodProducts />} />
                  <Route path="" element={<FoodAdmin />} />
                </Route>
              </Route>

              <Route
                path="finance"
                element={
                  <RequireAuth>
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="crypto" element={<CryptoInvestmentTable />} />
              </Route>

              <Route path="reading" element={<Books />} />

              <Route path="food" element={<Outlet />}>
                <Route path="recipes" element={<Outlet />}>
                  <Route path=":recipeId" element={<RecipeView />} />
                  <Route path="" element={<RecipeList />} />
                </Route>

                <Route path="mealPlans" element={<Outlet />}>
                  <Route path=":mealPlanId" element={<MealPlanView />} />
                  <Route path="" element={<MealPlans />} />
                </Route>
              </Route>

              <Route path="login" element={<Login />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Main;
