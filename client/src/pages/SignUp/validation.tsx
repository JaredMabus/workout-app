import { FormErrors } from "./useForm";

const validateFormData = (values: any) => {
  var errors: any = {};

  if (!values.email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Email address was invalid";
  }

  if (!values.password) {
    errors.password = "Password required";
  } else if (values.password.length < 6) {
    errors.password = "Must be more than 6 characters";
  }

  const notRequiredFields: any = [];
  var RequiredFields = Object.keys(values).filter((key) => {
    return !notRequiredFields.includes(key);
  });

  RequiredFields.forEach((key) => {
    if (values[key] === "") {
      errors[key] = "Required field";
    }
    if (!/\S/.test(values[key])) {
      errors[key] = "Required field";
    }
  });

  return errors;
};

export default validateFormData;
