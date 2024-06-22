import { Box, Grid, Typography, keyframes, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";

export const PointChart = ({ votes, pointScheme, containerDimensions }) => {
  const [seriesData, setSeriesData] = useState(null);
  const schemeConfig = VoteOptions[pointScheme];
  const theme = useTheme();
  const filteredVotes = votes?.filter((v) => v !== undefined && v !== null)

  const options = schemeConfig?.values;
  const averageCalculator = schemeConfig?.calculateAverage;
  const average = votes && averageCalculator(votes);

  useEffect(() => {
    if (!options || !votes) {
      return;
    }
    const voteCounts = filteredVotes
      .reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});

    const data = Object.entries(voteCounts)?.map(([label, value]) => {
      return {
        data: [value],
        stack: "A",
        label,
        disableLine: true,
        disableTicks: true, // figure me out, bro
      };
    });

    setSeriesData(data);
  }, [votes]);

  console.log(filteredVotes)
  if (!filteredVotes || filteredVotes.length <= 0 ||  !seriesData) return null;

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
    <Grid container direction="row" alignItems="center" justifyContent="center">
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
            legend: { hidden: false },
          }}
          layout="horizontal"
          series={seriesData}
          // xAxis={[{ disableGrid: true, label: "Votes"}]}
          width={containerDimensions?.containerWidth * 0.7}
          height={150}
        />
      </Grid>
    </Grid>
  );
};
