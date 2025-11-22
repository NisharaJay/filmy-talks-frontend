type LoginValues = { email: string; password: string };
type SignupValues = { fullName: string; email: string; password: string; confirmPassword: string };

export const validateLogin = (values: LoginValues) => {
  const errors = { email: "", password: "" };
  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email) {
    errors.email = "Email is required";
    valid = false;
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Enter a valid email";
    valid = false;
  }

  if (!values.password) {
    errors.password = "Password is required";
    valid = false;
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  return { errors, valid };
};

export const validateSignup = (values: SignupValues) => {
  const errors = { fullName: "", email: "", password: "", confirmPassword: "" };
  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.fullName) {
    errors.fullName = "Full name is required";
    valid = false;
  }

  if (!values.email) {
    errors.email = "Email is required";
    valid = false;
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Enter a valid email";
    valid = false;
  }

  if (!values.password) {
    errors.password = "Password is required";
    valid = false;
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  return { errors, valid };
};
