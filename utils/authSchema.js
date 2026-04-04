/*import * as Yup from "yup";
const validationSchema = Yup.object().shape({

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),

    password: Yup.string()
      .required("Password id required")
      .min(6, "Password should be at least 6 characters long"),
});

export default validationSchema;*/

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/,
      "Enter a valid email address"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters long"),
});

export default validationSchema;