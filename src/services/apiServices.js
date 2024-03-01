import { makeFormDataApiRequest, makeJsonApiRequest } from "./apiRequests";

const api_base_url = "http://localhost:3007/api/v1/companyAdmin/";
const card_base_url = "http://localhost:3007/api/v1/";

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

/*----- Auth Section -----*/

// login user
export const loginUser = async (loginCredentials) => {
  const response = await makeJsonApiRequest(
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

// logout user
export const logoutUser = async () => {
  try {
    setAuthToken(null);
    localStorage.removeItem("user-token");
    localStorage.removeItem("authenticated");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
};

// view profile
export const fetchViewProfile = async () => {
  const response = await makeJsonApiRequest(
    "get",
    `${api_base_url}showCAProfile`
  );
  return response;
};

// change password
export const changePassword = async (passwordCredentials) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}changePassword`,
    passwordCredentials
  );
  return response;
};

// edit profile
export const editProfile = async (updatedData) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}editProfile`,
    updatedData
  );
  return response;
};

// upload avatar
export const uploadAvatar = async (avatarData) => {
  const response = await makeFormDataApiRequest(
    "post",
    `${api_base_url}uploadAvatar`,
    avatarData
  );
  return response;
};

/*----- Card Section -----*/

// card lists
export const fetchCardsList = async () => {
  const response = await makeJsonApiRequest("get", `${api_base_url}cardLists`);
  return response;
};

// create business card
export const createBusinessCard = async (cardDetails) => {
  const response = await makeJsonApiRequest(
    "post",
    `${api_base_url}createCard`,
    cardDetails
  );
  return response;
};

// upload card profile pic
export const uploadCardProfilePic = async (imageData) => {
  const response = await makeFormDataApiRequest(
    "post",
    `${api_base_url}uploadCardProfilePicture`,
    imageData
  );
  return response;
};

export const fetchViewDigitalCardAll = async (queries) => {
  const response = await makeJsonApiRequest(
    "get",
    `${card_base_url}card?comp_name=${queries.companyName}&card_ref=${queries.cardReference}`
  );
  return response;
};

/*----- Company Section -----*/

// company details
export const fetchCompanyDetails = async () => {
  const response = await makeJsonApiRequest(
    "get",
    `${api_base_url}companyDetails`
  );
  return response;
};

// upload company logo
export const uploadCompanyLogo = async (imageData) => {
  const response = await makeFormDataApiRequest(
    "post",
    `${api_base_url}uploadCompanyLogo`,
    imageData
  );
  return response;
};

// edit company details
export const editCompanyDetails = async (updatedData) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}editCompanyDetails`,
    updatedData
  );
  return response;
};
