import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MealPlan } from "../common/client";
import { MealPlanApi } from "../common/client/FoodApi";
import MealPlanNoteList from "./MealPlanNoteList";
import MealPlanRecipeList from "./MealPlanRecipeList";

function MealPlanView() {
  const params = useParams() as any;
  const [mealPlan, setMealPlan] = useState<MealPlan | undefined>(undefined);
  useEffect(() => {
    MealPlanApi.get(params.mealPlanId).then((result) => setMealPlan(result));
  }, [params]);
  return (
    <>
      <Typography variant="h4" component="h4">
        {mealPlan?.name}
      </Typography>
      {mealPlan?.date && (
        <Typography variant="subtitle1" gutterBottom>
          Added on {mealPlan.date}
        </Typography>
      )}
      <Grid direction="column" container spacing={4}>
        <Grid item>
          <MealPlanRecipeList mealPlan={mealPlan} />
        </Grid>
        <Grid item>
          <MealPlanNoteList mealPlan={mealPlan} />
        </Grid>
      </Grid>
    </>
  );
}

export default MealPlanView;
