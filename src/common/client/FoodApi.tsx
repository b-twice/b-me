import {
  CookbookAuthorClient,
  FoodCategoryClient,
  FoodProductClient,
  FoodQuantityTypeClient,
  FoodUnitClient,
  MealPlanClient,
  MealPlanRecipeClient,
  SupermarketClient,
  RecipeCategoryClient,
  RecipeClient,
  RecipeIngredientClient,
  CookbookClient,
} from "./index";

const CookbookAuthorApi = new CookbookAuthorClient();
const CookbookApi = new CookbookClient();
const SupermarketApi = new SupermarketClient();
const FoodCategoryApi = new FoodCategoryClient();
const FoodProductApi = new FoodProductClient();
const RecipeCategoryApi = new RecipeCategoryClient();
const RecipeApi = new RecipeClient();
const RecipeIngredientApi = new RecipeIngredientClient();
const MealPlanApi = new MealPlanClient();
const MealPlanRecipeApi = new MealPlanRecipeClient();
const FoodQuantityTypeApi = new FoodQuantityTypeClient();
const FoodUnitApi = new FoodUnitClient();
export {
  SupermarketApi,
  CookbookAuthorApi,
  CookbookApi,
  FoodCategoryApi,
  FoodUnitApi,
  FoodQuantityTypeApi,
  RecipeCategoryApi,
  MealPlanApi,
  RecipeApi,
  RecipeIngredientApi,
  MealPlanRecipeApi,
  FoodProductApi,
};
