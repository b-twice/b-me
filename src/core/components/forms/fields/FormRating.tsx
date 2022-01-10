import Rating, { RatingProps } from "@mui/material/Rating";
import { RatingFieldSchema } from "../SchemaForm";

export default function FormRating(
  props: RatingProps & { schema: RatingFieldSchema }
) {
  return (
    <Rating
      {...props}
      sx={{
        ...(props.schema.icon === "favorite" && {
          "& .MuiRating-iconFilled": {
            color: "#ff6d75",
          },
          "& .MuiRating-iconHover": {
            color: "#ff3d47",
          },
        }),
      }}
    />
  );
}
