import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../common/client";
import { RecipeApi } from "../common/client/FoodApi";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import RecipeIngredientList from "./RecipeIngredientList";
import RecipeNoteList from "./RecipeNoteList";

function RecipeView() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  useEffect(() => {
    RecipeApi.get(+params["recipeId"]!).then((result) => setRecipe(result));
  }, [params]);

  return (
    <Fragment>
      <Typography variant="h4" component="h4">
        {recipe?.url && (
          <Link color="secondary" href={recipe?.url} underline="hover">
            {recipe?.name}
          </Link>
        )}
        {!recipe?.url && recipe?.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <em>{recipe?.cookbook?.name}</em>
        {recipe?.pageNumber !== undefined && recipe.pageNumber > 0 && (
          <span> pg. {recipe?.pageNumber}</span>
        )}
        <span>, Serves {recipe?.servings}</span>
        {recipe?.makeCount && (
          <Fragment>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span>
              Made {recipe.makeCount} time{recipe.makeCount > 1 && "s"}
            </span>
          </Fragment>
        )}
        {recipe?.lastMade && (
          <Fragment>
            <span>, last on {recipe?.lastMade}</span>
          </Fragment>
        )}
      </Typography>
      <Grid direction="column" container spacing={4}>
        <Grid item>
          <RecipeIngredientList recipe={recipe} />
        </Grid>
        <Grid item>
          <RecipeNoteList recipe={recipe} />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default RecipeView;
