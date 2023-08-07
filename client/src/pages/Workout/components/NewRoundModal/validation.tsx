import { FormErrors } from "./useForm";

const validateFormData = (values: Partial<FormErrors>) => {
  var errors: Partial<FormErrors> = {};
  const { sets } = values;
  // console.log("validate");
  const requiredFields: string[] = ["weight", "reps", "sets"];
  var RequiredFields = Object.keys(values).filter((key) => {
    return requiredFields.includes(key);
  });

  RequiredFields.forEach((key) => {
    if (values[key] === "") {
      errors[key] = "Required field";
    }
    if (!/\S/.test(values[key])) {
      errors[key] = "Must contain characters other than spaces";
    }
  });

  // sets.forEach((set: any) => {
  //   console.log(set);
  // });

  console.log(errors);
  return errors;
};

export default validateFormData;
