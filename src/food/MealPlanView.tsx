import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MealPlan } from "../common/client";
import { MealPlanApi } from "../common/client/FoodApi";
import MealPlanNoteList from "./MealPlanNoteList";
import MealPlanRecipeList from "./MealPlanRecipeList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginBottom: theme.spacing(4),
    },
  })
);

function MealPlanView() {
  const params = useParams() as any;
  const classes = useStyles();
  const [mealPlan, setMealPlan] = useState<MealPlan | undefined>(undefined);
  useEffect(() => {
    MealPlanApi.get(params.mealPlanId).then((result) => setMealPlan(result));
  }, [params]);
  return (
    <Fragment>
      <h1>{mealPlan?.name}</h1>
      <div className={classes.spacer}>
        <MealPlanRecipeList mealPlan={mealPlan} />
      </div>
      <MealPlanNoteList mealPlan={mealPlan} />
    </Fragment>
  );
}

export default MealPlanView;
