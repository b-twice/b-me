import Icon, { SvgIconProps } from "@mui/material/SvgIcon";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/Favorite";

export default function AppIcon(
  props: SvgIconProps & { type: string | undefined }
) {
  switch (props.type) {
    case "star":
      return <StarIcon {...props} />;
    case "star_border":
      return <StarBorderIcon {...props} />;
    case "favorite":
      return <FavoriteIcon {...props} />;
    case "favorite_border":
      return <FavoriteBorderIcon {...props} />;
  }
  return <Icon {...props} />;
}
