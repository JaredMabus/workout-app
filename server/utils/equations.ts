export const BMI = (height: number | string, weight: number | string) => {
  if (typeof height === "string") height = parseInt(height);
  if (typeof weight === "string") weight = parseInt(weight);
  height = height * 12;
  let bmi = (703 * weight) / Math.pow(height, 2);
  return bmi.toFixed(2);
};
