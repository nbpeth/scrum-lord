import { BarChart, LineChart } from "@mui/x-charts";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";
import { useEffect, useState } from "react";

export const PointChart = ({ community }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const votes = community?.citizens?.map((citizen) => citizen.vote) ?? [];
    const options = VoteOptions[community?.pointScheme];
    if(!options || !votes) {
        return;
    }
    const voteCounts = votes?.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {});

    console.log(voteCounts)
    const lineChartData = options?.map(option => {
        return {
            name: option,
            data: [voteCounts[option] || 0]
        }
    })


    //     return res;
    // }, [])
    // const lineChartData = options?.map((option) => ({
    //     name: option,
    //     data: [voteCounts[option] || 0],
    //   }));
    // console.log("op", options?.filter(x => voteCounts[x]))

    setChartData({
      series: lineChartData,
      xAxis: [{ data: options?.filter(x => voteCounts[x]) }],
    });
  }, [community]);

  if (!chartData) return null;
  console.log(chartData);

  return (
    <LineChart
      xAxis={chartData.xAxis}

      series={chartData.series}

      width={500}
      height={300}
    />
  );
};
