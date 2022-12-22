import { FormErrors } from "./useForm";

const validateFormData = (values: any) => {
  var errors: any = {};

  const requiredFields: any = [];
  var RequiredFields = Object.keys(values).filter((key) => {
    return requiredFields.includes(key);
  });

  RequiredFields.forEach((key) => {
    if (values[key] === "") {
      errors[key] = "Required field";
    }
    if (!/\S/.test(values[key])) {
      errors[key] = "Must contain characters";
    }
  });

  return errors;
};

export default validateFormData;
