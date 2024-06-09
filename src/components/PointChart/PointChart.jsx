import { Box, Grid, Typography, keyframes, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";

export const PointChart = ({ votes, pointScheme, containerDimensions }) => {
  const [seriesData, setSeriesData] = useState(null);
  const schemeConfig = VoteOptions[pointScheme];
  const theme = useTheme();

  const options = schemeConfig?.values;
  const averageCalculator = schemeConfig?.calculateAverage;
  const average = votes && averageCalculator(votes);

  useEffect(() => {
    if (!options || !votes) {
      return;
    }
    const voteCounts = votes
      ?.filter((v) => v !== undefined && v !== null)
      .reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});

    const data = Object.entries(voteCounts).map(([label, value]) => {
      return {
        data: [value],
        stack: "A",
        label,
      };
    });
    setSeriesData(data);
  }, [votes]);

  if (!seriesData) return null;

  const colorChange = keyframes`
    0% { color: ${theme.palette.primary.main}; }
    10% { color: ${theme.palette.primary.light}; }
    20% { color: ${theme.palette.primary.dark}; }
    30% { color: ${theme.palette.secondary.main}; }
    40% { color: ${theme.palette.secondary.light}; }
    50% { color: ${theme.palette.secondary.dark}; }
    60% { color: ${theme.palette.error.main}; }
    70% { color: ${theme.palette.error.light}; }
    80% { color: ${theme.palette.error.dark}; }
    90% { color: ${theme.palette.warning.main}; }
    100% { color: ${theme.palette.info.main}; }
  `;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{
            animation: `${colorChange} 2s infinite`,
          }}
        >
          {average}
        </Typography>
      </Grid>
      <Grid item>
        <BarChart
          slotProps={{
            legend: { hidden: true },
          }}
          series={seriesData}
          width={
            containerDimensions?.containerWidth >= 155
              ? containerDimensions?.containerWidth
              : 155
          }
          height={containerDimensions?.containerHeight * 0.7}
        />
      </Grid>
    </Grid>
  );
};
