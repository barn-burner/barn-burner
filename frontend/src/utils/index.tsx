import _ from "lodash";

export const calculatePercentage = (input:number):number => {
  return Math.round(input * 100);
}

export const calculateAverage = (input: number[]):number => {
  const avg = _.mean(input);
  const avgRounded = (Math.round(avg * 10) / 10);
  return avgRounded;
};

export const getParams = (input: string): number => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const q = params.get(input);

  return q ? parseInt(q) : 1;
}

export const getDateParams = (input: string) => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const q = params.get(input);

  return q || undefined;
}
