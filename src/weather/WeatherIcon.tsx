import { Typography } from "@mui/material";
import { Icon } from "../common/client";

interface WeatherIconProps {
  type: Icon;
  size: "small" | "large";
}

const getWeatherIcon = (type: Icon): string => {
  switch (type) {
    case Icon.ClearDay:
    case Icon.None:
      return "\u2600\ufe0f";
    case Icon.ClearNight:
      return "\ud83c\udf11";
    case Icon.Cloudy:
    case Icon.PartlyCloudyNight:
      return "\u2601\ufe0f";
    case Icon.PartlyCloudyDay:
      return "\u26c5";
    case Icon.Rain:
      return "\ud83c\udf27\ufe0f";
    case Icon.Snow:
    case Icon.Sleet:
      return "\ud83c\udf28\ufe0f";
    case Icon.Fog:
      return "\ud83c\udf2b\ufe0f";
    case Icon.Wind:
      return "\ud83d\udca8";
    default:
      return "\u2600\ufe0f";
  }
};

// I know, this is as cheap as a solution as you can get - emojis.
export default function WeatherIcon({ type, size }: WeatherIconProps) {
  return (
    <Typography
      fontWeight="regular"
      fontFamily="apple color emoji,segoe ui emoji,noto color emoji,android emoji,emojisymbols,emojione mozilla,twemoji mozilla,segoe ui symbol"
      fontStyle="normal"
      sx={{
        ...(size === "large" && {
          typography: "h2",
          lineHeight: "20px",
          height: "30px",
        }),
        ...(size !== "large" && {
          typography: "h4",
          lineHeight: "5px",
          height: "10px",
        }),
      }}
    >
      <span role="img" aria-label="weather">
        {getWeatherIcon(type)}
      </span>
    </Typography>
  );
}
