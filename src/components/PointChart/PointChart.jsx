import { keyframes, styled, useTheme } from "@mui/material";
import { PieChart, useDrawingArea } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";

export const PointChart = ({ votes, pointScheme, containerWidth }) => {
  const [seriesData, setSeriesData] = useState(null);
  const schemeConfig = VoteOptions[pointScheme];
  const theme = useTheme();
  const options = schemeConfig?.values;
  const averageCalculator = schemeConfig?.calculateAverage
  const average = votes && averageCalculator(votes);

  useEffect(() => {
    if (!options || !votes) {
      return;
    }
    const voteCounts = votes?.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(voteCounts).map(([label, value]) => ({
      label,
      value,
    }));

    setSeriesData(data);
  }, [votes]);

  if (!seriesData) return null;

  const colorChange = keyframes`
    0% { fill: ${theme.palette.secondary.main}; }
    25% { fill: ${theme.palette.secondary.dark} }
    50% { fill: #fff; }
    75% { fill: ${theme.palette.secondary.dark} }
    100% { fill: ${theme.palette.secondary.main}; }
  `;

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "text-after-edge",
    fontSize: 60,
    // stroke: "red",
    // strokeWidth: 2,
    fontWeight: 800,
    animation: `${colorChange} 1s infinite`,
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2 - 15}>
        {children}
      </StyledText>
    );
  }

  const getArcLabel = (params) => {
    return params?.label === "null" ? "-" : params?.label;
  };

  return (
    <PieChart
      slotProps={{
        legend: { hidden: true },
      }}
      width={containerWidth}
      height={containerWidth}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      series={[
        {
          startAngle: -90,
          endAngle: 90,
          innerRadius: 120,
          data: seriesData,
          paddingAngle: 5,
          arcLabel: getArcLabel,
          arcLabelMinAngle: 5,
        },
      ]}
    >
      <PieCenterLabel>{average}</PieCenterLabel>
    </PieChart>
  );
};
