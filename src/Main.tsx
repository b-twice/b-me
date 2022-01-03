import React from "react";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme, Toolbar, Container, Box } from "@material-ui/core";
import Header from "./core/Header";
import { Route } from "react-router";
import Home from "./core/Home";
import BlogContentRoute from "./blog/BlogContentRoute";
import Login from "./core/Login";
import ScrollToTop from "./core/components/ScrollToTop";
import Books from "./books/Books";
import BookAuthors from "./books/BookAuthors";
import BookCategories from "./books/BookCategories";
import BookStatuses from "./books/BookStatuses";
import { PrivateRoute } from "./core/Auth";
import Transactions from "./finance/Transactions";
import FinanceDashboard from "./finance/Dashboard";
import FinanceExpenses from "./finance/Expenses";
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

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    app: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      margin: "0 auto",
      background: theme.palette.primary.main,
    },
    main: {
      flexGrow: 1,
      overflow: "hidden",
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
    container: {},
  });
});

function Main() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <Header />
      <main className={classes.main}>
        <Toolbar />
        <Container className={classes.container}>
          <Box my={4}>
            <ScrollToTop>
              <Route exact path="/" component={Home} />
              <Route exact path="/content/*" component={BlogContentRoute} />

              <PrivateRoute exact path="/admin/content" component={BlogPosts} />

              <PrivateRoute
                exact
                path="/finance/dashboard"
                component={FinanceDashboard}
              />
              <PrivateRoute
                exact
                path="/finance/transactions"
                component={Transactions}
              />
              <PrivateRoute
                exact
                path="/finance/expenses"
                component={FinanceExpenses}
              />

              <Route exact path="/reading/books" component={Books} />
              <PrivateRoute
                exact
                path="/reading/admin"
                component={ReadingAdmin}
              />
              <PrivateRoute
                exact
                path="/reading/authors"
                component={BookAuthors}
              />
              <PrivateRoute
                exact
                path="/reading/categories"
                component={BookCategories}
              />
              <PrivateRoute
                exact
                path="/reading/statuses"
                component={BookStatuses}
              />

              <PrivateRoute
                exact
                path="/food/cookbookAuthors"
                component={CookbookAuthors}
              />
              <PrivateRoute
                exact
                path="/food/cookbooks"
                component={Cookbooks}
              />
              <PrivateRoute
                exact
                path="/food/supermarkets"
                component={Supermarkets}
              />
              <PrivateRoute
                exact
                path="/food/productCategories"
                component={FoodCategories}
              />
              <PrivateRoute
                exact
                path="/food/recipeCategories"
                component={RecipeCategories}
              />
              <PrivateRoute
                exact
                path="/food/products"
                component={FoodProducts}
              />
              <Route
                exact
                path="/food/recipes/:recipeId"
                component={RecipeView}
              />
              <Route exact path="/food/recipes" component={RecipeList} />
              <Route
                exact
                path="/food/mealPlans/:mealPlanId"
                component={MealPlanView}
              />
              <Route exact path="/food/mealPlans" component={MealPlans}></Route>
              <PrivateRoute exact path="/food/admin" component={FoodAdmin} />

              <Route exact path="/login" component={Login} />
            </ScrollToTop>
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default Main;
