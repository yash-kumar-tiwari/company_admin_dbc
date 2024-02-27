import { message } from "antd";
import axios from "axios";

const api_base_url = "http://localhost:3007/api/v1/companyAdmin/";

// Function to set authentication token in local storage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("user-token", token);
    localStorage.setItem("authenticated", true);
  } else {
    localStorage.removeItem("user-token");
    localStorage.setItem("authenticated", false);
  }
};

// Function to make API requests
const makeApiRequest = async (
  method,
  endpoint,
  data = null,
  token = null,
  dataType = "json"
) => {
  try {
    let headers = {};
    let requestData = data;

    // Check if token is available in localStorage
    const storedToken = localStorage.getItem("user-token");

    // If token is available in localStorage, set it to headers
    if (storedToken) {
      headers = {
        "Content-Type":
          dataType === "form-data" ? "multipart/form-data" : "application/json",
        Authorization: `${storedToken}`,
      };
    } else {
      headers = {
        "Content-Type":
          dataType === "form-data" ? "multipart/form-data" : "application/json",
      };
    }

    if (dataType === "form-data" && data) {
      requestData = new FormData();
      for (const key in data) {
        requestData.append(key, data[key]);
      }
    }

    const config = {
      method,
      url: endpoint,
      data: requestData,
      headers,
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// login user
export const loginUser = async (loginCredentials) => {
  const response = await makeApiRequest(
    "post",
    `${api_base_url}loginCompanyAdmin`,
    loginCredentials
  );
  if (response && response.status === 200) {
    setAuthToken(response.data.data.token);
    // localStorage.setItem("user-data", JSON.stringify(response.data.userData));
    // message.success(response.message);
  }
  return response;
};

// view profile
export const fetchViewProfile = async () => {
  const response = await makeApiRequest("get", `${api_base_url}showCAProfile`);
  return response;
};

// change password
export const changePassword = async (passwordCredentials) => {
  const response = await makeApiRequest(
    "put",
    `${api_base_url}changePassword`,
    passwordCredentials
  );
  return response;
};

// edit profile
export const editProfile = async (updatedData) => {
  const response = await makeApiRequest(
    "put",
    `${api_base_url}editProfile`,
    updatedData
  );
  return response;
};

// upload avatar
export const uploadAvatar = async (avatarData) => {};

// logout user
export const logoutUser = () => {
  setAuthToken(null);
  localStorage.removeItem("user-token");
  localStorage.removeItem("authenticated");
};
