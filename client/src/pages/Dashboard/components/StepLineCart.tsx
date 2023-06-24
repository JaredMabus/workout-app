import React, { useState, useEffect, useLayoutEffect } from "react";
import { chartData, setChartData } from "../mockData";
import { ResponsiveLine } from "@nivo/line";
import { Stack, Typography, alpha } from "@mui/material";
import { grey } from "@mui/material/colors";
import { subDays, subMonths, format, parse } from "date-fns";
// import { scaleTime } from "d3-scale";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import * as ui from "../../../Redux/slices/uiSlice";
import * as wk from "../../../Redux/slices/workoutSlice";

export interface StepLineChartDataType {
  id: string;
  color?: string;
  data: ChartDataObj[];
}

export interface ChartDataObj {
  x: string | number | Date;
  y: string | number | Date;
}

export interface Props {
  data: wk.WorkoutType | [];
}

// const dateFormat = "L/d/y";
const dateFormat = "%m/%d/%Y";

export default function StepLineChart({ data }: Props) {
  const dispatch = useDispatch();
  const wkState = useSelector(wk.selectWorkout);
  const uiState = useSelector(ui.selectUi);
  const [workout, setWorkout] = useState<Partial<wk.WorkoutType> | []>(data);
  const [roundData, setRoundData] = useState<wk.RoundType[] | string[] | []>(
    !Array.isArray(data) ? data.roundId : []
  );
  const [filteredRoundData, setFilteredRoundData] = useState<
    wk.RoundType[] | string[] | []
  >([]);
  const [chartData, setChartData] = useState<
    Partial<StepLineChartDataType[] | []>
  >([]);

  const convertRoundDataToChartData = () => {
    try {
      // Extract Weight, Sets, and Reps data from workout object
      if (
        workout != null &&
        typeof workout === "object" &&
        !Array.isArray(workout)
      ) {
        if (filteredRoundData != null) {
          let attributeMap: { [id: string]: StepLineChartDataType } = {
            Sets: { id: "Sets", data: [] },
            Reps: { id: "Reps", data: [] },
            Weight: { id: "Weight", data: [] },
          };
          filteredRoundData.forEach((round) => {
            if (typeof round === "object" && round.date != null) {
              const lastRepIndex = round.sets.length - 1;
              let row: ChartDataObj = {
                x: new Date(round.date),
                y: round.sets[lastRepIndex].weight,
              };
              attributeMap.Weight.data.push(row);
              attributeMap.Reps.data.push({
                ...row,
                y: round.sets[lastRepIndex].reps,
              });
              attributeMap.Sets.data.push({ ...row, y: round.sets.length });
            }
          });
          const finalData = Object.values(attributeMap);
          Object.values(finalData).forEach((entity) => {
            entity.data.sort((a: any, b: any) => a.x.getTime() - b.x.getTime());
          });
          setChartData(finalData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filterData = () => {
    if (
      uiState.activeTabDataFilter != null &&
      Array.isArray(roundData) &&
      roundData[0] != null &&
      typeof roundData[0] === "object"
    ) {
      // Type guard above accounts for the 'filter' type error below
      // @ts-ignore
      const newFilteredRoundData = roundData.filter(
        (item: wk.RoundType) => item.method === uiState.activeTabDataFilter
      );
      setFilteredRoundData(newFilteredRoundData);
    } else {
      setFilteredRoundData([]);
    }
  };

  useEffect(() => {
    setWorkout(data);
    if (!Array.isArray(data)) {
      setRoundData(data.roundId);
      dispatch(
        ui.setActiveTabDataFilter(
          data.methodSelection[0] as wk.WorkoutMethodType
        )
      );
    }
  }, [data, workout]);

  useEffect(() => {
    filterData();
  }, [roundData, workout, uiState.activeTabDataFilter]);

  useEffect(() => {
    convertRoundDataToChartData();
  }, [filteredRoundData]);

  const today = new Date();
  return (
    <>
      {workout != null &&
        typeof workout === "object" &&
        !Array.isArray(workout) && (
          <Stack
            sx={{
              border: `1px solid ${grey[50]}`,
              // boxShadow: `rgb(0 0 0 / 10%) 0px 0px 5px 4px`,
              borderRadius: 4,
              p: 2,
              pb: 1,
              m: 1,
              width: "100%",
            }}
          >
            <Stack sx={{ width: "100%", height: "100%" }}>
              <Stack sx={{ pl: 1, borderBottom: `1px solid ${grey[200]}` }}>
                <Typography variant="h5">
                  {workout?.name
                    ? `${workout.name}: ${uiState.activeTabDataFilter} `
                    : "No Data"}
                </Typography>
                <Typography variant="subtitle2">3 month progress</Typography>
              </Stack>
              <Stack
                sx={{
                  height: 400,
                  maxHeight: "100%",
                  width: "100%",
                  maxWidth: "100%",
                  overflowX: "scroll",
                  overflowY: "hidden",
                }}
              >
                {workout &&
                  workout.roundId &&
                  !Array.isArray(workout) &&
                  workout.roundId.length === 0 && (
                    <Stack sx={{ p: 1 }}>
                      <Typography variant="h5">No round data</Typography>
                    </Stack>
                  )}
                {workout &&
                  workout.roundId &&
                  !Array.isArray(workout) &&
                  workout.roundId.length > 0 && (
                    <Stack
                      sx={{
                        height: "100%",
                        maxHeight: "100%",
                        width: { xs: 1000, sm: 1000, md: "100%" },
                        minWidth: { xs: 1000, sm: 1000, md: "100%" },
                        maxWidth: "100%",
                      }}
                    >
                      <ResponsiveLine
                        // @ts-ignore
                        data={chartData}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{
                          type: "time",
                          format: "%m/%d/%Y",
                          precision: "day",
                          // min: subMonths(today, 1),
                          max: today,
                        }}
                        xFormat="time:%m/%d/%Y"
                        yScale={{
                          type: "linear",
                          min: "auto",
                          max: "auto",
                          stacked: false,
                          reverse: false,
                        }}
                        curve="linear"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          format: "%b %d, %y",
                          tickValues: "every week",
                          tickSize: 5,
                          tickPadding: 5,
                          legend: "Date",
                          legendOffset: 36,
                          legendPosition: "middle",
                        }}
                        axisLeft={{
                          // tickSize: 5,
                          // tickPadding: 5,
                          legend: "Weight (lbs) | Sets | Reps",
                          legendOffset: -40,
                          legendPosition: "middle",
                        }}
                        enablePointLabel={true}
                        // colors={{ scheme: "set1" }}
                        colors={[
                          alpha(grey[400], 0.5),
                          alpha("hsl(37.47,95.95%,48.43%)", 0.8),
                          "hsl(217.42,89%,60.78%)",
                        ]}
                        enableSlices="x"
                        pointSize={10}
                        lineWidth={3}
                        pointColor={{ theme: "background" }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: "serieColor" }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        enableGridX={true}
                        enableGridY={false}
                        enableCrosshair={true}
                        animate={true}
                        legends={[
                          {
                            anchor: "top-left",
                            direction: "row",
                            justify: false,
                            translateX: 0,
                            translateY: -42,
                            itemsSpacing: 1,
                            itemDirection: "left-to-right",
                            itemWidth: 100,
                            itemHeight: 20,
                            itemOpacity: 1,
                            symbolSize: 12,
                            symbolShape: "circle",
                            symbolBorderColor: "rgba(0, 0, 0, .5)",
                            effects: [
                              {
                                on: "hover",
                                style: {
                                  itemBackground: "rgba(0, 0, 0, .03)",
                                  itemOpacity: 1,
                                },
                              },
                            ],
                          },
                        ]}
                      />
                    </Stack>
                  )}
              </Stack>
            </Stack>
          </Stack>
        )}
    </>
  );
}

// OLD
// <ResponsiveLine
//   // @ts-ignore
//   data={chartData}
//   curve="step"
//   margin={{ top: 60, right: 110, bottom: 60, left: 60 }}
//   // xScale={{ type: "point" }}
//   xScale={{
//     type: "time",
//     format: "%m/%d/%Y", // The date format you are using in your data
//     precision: "day", // The precision you want to use for the dates
//   }}
//   yScale={{
//     type: "linear",
//     min: 0,
//     max: "auto",
//     stacked: false,
//   }}
//   colors={[
//     alpha(grey[400], 0.5),
//     alpha("hsl(37.47,95.95%,48.43%)", 0.8),
//     "hsl(217.42,89%,60.78%)",
//   ]}
//   theme={{
//     background: "#fff",
//     fontSize: 15,
//     fontFamily: "Saira Semi Condensed",
//     grid: { line: { stroke: alpha(grey[300], 0.8) } },
//   }}
//   lineWidth={3}
//   // yFormat=" >-.2f"
//   enableSlices="x"
//   axisTop={null}
//   axisRight={null}
//   //   axisBottom={{
//   //     tickSize: 5,
//   //     tickPadding: 5,
//   //     tickRotation: 0,
//   //     legend: "Date",
//   //     legendOffset: 36,
//   //     legendPosition: "middle",
//   //   }}
//   axisLeft={{
//     tickSize: 5,
//     tickPadding: 8,
//     tickRotation: 0,
//     legend: "Weight (lbs) | Rounds | Sets",
//     legendOffset: -50,
//     legendPosition: "middle",
//   }}
//   enablePointLabel={true}
//   pointLabel="y"
//   pointSize={10}
//   pointColor={{ theme: "background" }}
//   pointBorderWidth={2}
//   pointBorderColor={{ from: "serieColor" }}
//   pointLabelYOffset={-12}
//   useMesh={true}
//   legends={[
//     {
//       anchor: "top-left",
//       direction: "row",
//       justify: false,
//       translateX: 0,
//       translateY: -42,
//       itemsSpacing: 1,
//       itemDirection: "left-to-right",
//       itemWidth: 100,
//       itemHeight: 20,
//       itemOpacity: 1,
//       symbolSize: 12,
//       symbolShape: "circle",
//       symbolBorderColor: "rgba(0, 0, 0, .5)",
//       effects: [
//         {
//           on: "hover",
//           style: {
//             itemBackground: "rgba(0, 0, 0, .03)",
//             itemOpacity: 1,
//           },
//         },
//       ],
//     },
//   ]}
//   enableGridX={true}
//   enableGridY={false}
//   enableCrosshair={true}
//   animate={true}
// />
