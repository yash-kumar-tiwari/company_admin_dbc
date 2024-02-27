import { toast } from "react-toastify";

// getAuthenticationToken from localStorage for logged in users
export const getAuthenticationToken = () => {
  let userToken = localStorage.getItem("user-token");
  let config = {
    headers: {
      Authorization: userToken,
    },
  };
  return config;
};

// remove authenticationToken from localStorage when logged out & invalid token users
export const removeAuthenticationToken = () => {
  localStorage.removeItem("user-token");
  localStorage.removeItem("user-data");
};

// handle authentication error and navigate to the signin if status 401 from api is returned
export const handleAuthenticationError = (errorMessage, navigate) => {
  toast.error(errorMessage);
  removeAuthenticationToken();
  navigate("/signin");
};
