import axios from "../../lib/axios";
import { FormValues } from "./useForm";

/** default config cor register account API */
const instance = axios.create({
  withCredentials: true,
  validateStatus: function (status: number) {
    // Set to less than 600 for custom error handling
    return status < 600;
  },
});

export const signUpApi = async (values: Omit<FormValues, "showPassword">) => {
  const response = await instance.post("account", values);
  return response;
};
