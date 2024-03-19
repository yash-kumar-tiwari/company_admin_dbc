import { makeFormDataApiRequest, makeJsonApiRequest } from "./apiRequests";

const api_base_url = "https://midin.app/api/v1/companyAdmin/";
const card_base_url = "https://midin.app/api/v1/";

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

// forget password
export const forgetPassword = async (email) => {
  const response = await makeJsonApiRequest(
    "post",
    `${api_base_url}forgetPassword`,
    email
  );
  return response;
};

// reset password
export const resetPassword = async (passwordCredentials) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}resetPassword`,
    passwordCredentials
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

// upload cover image
export const uploadCardCoverPic = async (imageData) => {
  const response = await makeFormDataApiRequest(
    "post",
    `${api_base_url}uploadCardCoverPicture`,
    imageData
  );
  return response;
};

// activate card for QR
export const activateCardforQRCode = async (cardID) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}activateSingleCardForQr?card_id=${cardID}`,
    {}
  );
  return response;
};

// activate multiple card for QR
export const activateMultipleCardforQRCode = async (cardIDs) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}activateMultipleCardsForQR`,
    cardIDs
  );
  return response;
};

// deactivate card
export const deactivateCard = async (cardID) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}deactivateCard?card_id=${cardID}`,
    {}
  );
  return response;
};

// delete card
export const deleteCard = async (cardID) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}deleteCard?card_id=${cardID}`,
    {}
  );
  return response;
};

// view card
export const fetchViewDigitalCard = async (cardID) => {
  const response = await makeJsonApiRequest(
    "get",
    `${api_base_url}cardDetailsForCA?card_id=${cardID}`
  );
  return response;
};

// edit card
export const editCardDetails = async (updatedData) => {
  const response = await makeJsonApiRequest(
    "put",
    `${api_base_url}editCard`,
    updatedData
  );
  return response;
};

// view card for all
export const fetchViewDigitalCardAll = async (queries) => {
  const response = await makeJsonApiRequest(
    "get",
    `${card_base_url}card?comp_name=${queries.companyName}&card_ref=${queries.cardReference}`
  );
  return response;
};

// get vcf card of card
export const getVCFCardforDigitalCard = async (vcfCardID) => {
  const response = await makeJsonApiRequest(
    "get",
    `${card_base_url}vcf?card_id=${vcfCardID}`
  );
  return response;
};

// cards url lists
export const fetchCardsUrlList = async () => {
  const response = await makeJsonApiRequest("get", `${api_base_url}qrCodeList`);
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
    "post",
    `${api_base_url}editCompanyDetails`,
    updatedData
  );
  return response;
};
