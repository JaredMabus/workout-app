import { FormErrors } from "./useForm";

const validateFormData = (values: any) => {
  var errors: FormErrors = {};

  if (!values.email) {
    errors.email = "Email required";
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      values.email
    )
  ) {
    errors.email = "Email address was invalid";
  }

  // if (!values.password) {
  //   errors.password = "Password required";
  // } else if (values.password.length < 6) {
  //   errors.password = "Password must be more than 6 characters";
  // }

  return errors;
};

export default validateFormData;
