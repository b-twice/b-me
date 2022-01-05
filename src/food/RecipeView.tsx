import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "../common/client";
import { RecipeApi } from "../common/client/FoodApi";
import { createStyles, Link, makeStyles, Theme } from "@material-ui/core";
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
      {recipe?.url && (
        <Link color="secondary" href={recipe?.url}>
          <h1>{recipe?.name}</h1>
        </Link>
      )}
      {!recipe?.url && <h1>{recipe?.name}</h1>}
      <div className={classes.spacer}>
        <RecipeIngredientList recipe={recipe} />
      </div>
      <RecipeNoteList recipe={recipe} />
    </Fragment>
  );
}

export default RecipeView;
