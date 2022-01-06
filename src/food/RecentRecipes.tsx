import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItemText,
  ListItem,
  CardActions,
  Button,
  Divider,
} from "@material-ui/core";
import AppLink from "../core/components/AppLink";
import { Recipe } from "../common/client";
import AppSpinner from "../core/components/AppSpinner";
import { RecipeApi } from "../common/client/FoodApi";
import { Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import ListItemLink from "../core/components/ListItemLink";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      width: "300px",
    },
  });
});

function RecentRecipesCard() {
  const classes = useStyles();

  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    RecipeApi.getRecent(5)
      .then((recipes) => {
        setRecipes(recipes);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(`Error fetching recipes: ${err.message}`);
        setIsLoading(false);
        setRecipes([]);
      });
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Recipes
        </Typography>
        {isLoading ? (
          <AppSpinner />
        ) : (
          <List disablePadding component="div" dense>
            {error && (
              <Typography color="error" variant="overline">
                {error}
              </Typography>
            )}
            {recipes.map((recipe) => (
              <ListItemLink
                key={recipe.id}
                path={`/food/recipes/${recipe?.id}`}
                name={recipe.name!}
                secondary={recipe.cookbook?.name}
              />
            ))}
          </List>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <AppLink to="/food/recipes">
          <Button size="small" color="secondary">
            View More
          </Button>
        </AppLink>
      </CardActions>
    </Card>
  );
}

export default RecentRecipesCard;
