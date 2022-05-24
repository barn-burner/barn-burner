import _ from "lodash";

export const calculatePercentage = (input:number):number => {
  return Math.round(input * 100);
}

export const calculateAverage = (input: number[]):number => {
  const avg = _.mean(input);
  const avgRounded = (Math.round(avg * 10) / 10);
  return avgRounded;
};