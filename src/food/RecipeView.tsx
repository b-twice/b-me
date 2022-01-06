import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../common/client";
import { RecipeApi } from "../common/client/FoodApi";
import {
  createStyles,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import RecipeIngredientList from "./RecipeIngredientList";
import RecipeNoteList from "./RecipeNoteList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginBottom: theme.spacing(4),
    },
  })
);

function RecipeView() {
  const params = useParams();
  const classes = useStyles();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  useEffect(() => {
    RecipeApi.get(+params["recipeId"]!).then((result) => setRecipe(result));
  }, [params]);

  return (
    <Fragment>
      <Typography variant="h4" component="h4">
        {recipe?.url && (
          <Link color="secondary" href={recipe?.url}>
            {recipe?.name}
          </Link>
        )}
        {!recipe?.url && recipe?.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        By <em>{recipe?.cookbook?.name}</em>&nbsp;&nbsp;&nbsp;
        <span>Servings: {recipe?.servings}</span>&nbsp;&nbsp;&nbsp;
        {recipe?.pageNumber !== undefined && recipe.pageNumber > 0 && (
          <span>Page #: {recipe?.pageNumber}</span>
        )}
      </Typography>
      <div className={classes.spacer}>
        <RecipeIngredientList recipe={recipe} />
      </div>
      <RecipeNoteList recipe={recipe} />
    </Fragment>
  );
}

export default RecipeView;
