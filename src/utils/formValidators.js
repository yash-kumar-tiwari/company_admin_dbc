export const validateEmail = (_, value) => {
  // Regular expression to check if the value is a valid email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return Promise.reject("Please enter a valid email!");
  }
  return Promise.resolve();
};

export const validatePassword = (_, value) => {
  if (value.length < 8) {
    return Promise.reject("Password must be at least 8 characters long!");
  }
  return Promise.resolve();
};
