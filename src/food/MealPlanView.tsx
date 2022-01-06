import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
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
      <Typography variant="h4" component="h4">
        {mealPlan?.name}
      </Typography>
      {mealPlan?.date && (
        <Typography variant="subtitle1" gutterBottom>
          Added on {mealPlan.date}
        </Typography>
      )}
      <div className={classes.spacer}>
        <MealPlanRecipeList mealPlan={mealPlan} />
      </div>
      <MealPlanNoteList mealPlan={mealPlan} />
    </Fragment>
  );
}

export default MealPlanView;
