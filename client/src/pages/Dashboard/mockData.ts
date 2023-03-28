import { StepLineChartDataType } from "./components/StepLineCart";
import { subDays, format } from "date-fns";

const today = new Date();
const dateFormat = "L/d";

export const chartData: StepLineChartDataType[] = [
  {
    id: "Rounds",
    data: [
      {
        x: format(subDays(today, 40), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 18), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 17), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 15), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 12), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 10), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 8), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 6), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 3), dateFormat),
        y: 3,
      },
      {
        x: format(today, dateFormat),
        y: 3,
      },
    ],
  },
  {
    id: "Sets (min)",
    data: [
      {
        x: format(subDays(today, 40), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 18), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 17), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 15), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 12), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 10), dateFormat),
        y: 6,
      },
      {
        x: format(subDays(today, 8), dateFormat),
        y: 6,
      },
      {
        x: format(subDays(today, 6), dateFormat),
        y: 6,
      },
      {
        x: format(subDays(today, 3), dateFormat),
        y: 7,
      },
      {
        x: format(today, dateFormat),
        y: 8,
      },
    ],
  },
  {
    id: "Weight",
    data: [
      {
        x: format(subDays(today, 40), dateFormat),
        y: 15,
      },
      {
        x: format(subDays(today, 18), dateFormat),
        y: 15,
      },
      {
        x: format(subDays(today, 17), dateFormat),
        y: 15,
      },
      {
        x: format(subDays(today, 15), dateFormat),
        y: 15,
      },
      {
        x: format(subDays(today, 12), dateFormat),
        y: 15,
      },
      {
        x: format(subDays(today, 10), dateFormat),
        y: 20,
      },
      {
        x: format(subDays(today, 8), dateFormat),
        y: 20,
      },
      {
        x: format(subDays(today, 6), dateFormat),
        y: 25,
      },
      {
        x: format(subDays(today, 3), dateFormat),
        y: 25,
      },
      {
        x: format(today, dateFormat),
        y: 30,
      },
    ],
  },
];

export const setChartData: StepLineChartDataType[] = [
  {
    id: "Roudns",
    data: [
      {
        x: format(subDays(today, 10), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 8), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 6), dateFormat),
        y: 3,
      },
      {
        x: format(subDays(today, 3), dateFormat),
        y: 3,
      },
      {
        x: format(today, dateFormat),
        y: 3,
      },
    ],
  },
  {
    id: "Min Set",
    data: [
      {
        x: format(subDays(today, 10), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 8), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 6), dateFormat),
        y: 7,
      },
      {
        x: format(subDays(today, 3), dateFormat),
        y: 8,
      },
      {
        x: format(today, dateFormat),
        y: 8,
      },
    ],
  },
];
