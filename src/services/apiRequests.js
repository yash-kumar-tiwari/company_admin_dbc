import axios from "axios";

// Function to make API requests with JSON data
export const makeJsonApiRequest = async (
  method,
  endpoint,
  jsonData = null,
  token = null
) => {
  try {
    let headers = {};
    const storedToken = localStorage.getItem("user-token");

    if (storedToken) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `${storedToken}`,
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
    }

    const config = {
      method,
      url: endpoint,
      data: jsonData,
      headers,
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Function to make API requests with form data
export const makeFormDataApiRequest = async (
  method,
  endpoint,
  formData = null,
  token = null
) => {
  try {
    let headers = {};
    const storedToken = localStorage.getItem("user-token");

    if (storedToken) {
      headers = {
        Authorization: `${storedToken}`,
      };
    }

    // Create FormData object
    const requestData = new FormData();

    // If formData is an array, append each file individually
    if (Array.isArray(formData)) {
      formData.forEach((file, index) => {
        requestData.append(`images`, file);
      });
    } else {
      // If formData is a single file, append it
      requestData.append("image", formData);
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

// Function to make API requests with dynamic form data
export const makeDynamicFormDataApiRequest = async (
  method,
  endpoint,
  formData = null,
  token = null
) => {
  try {
    let headers = {};
    const storedToken = localStorage.getItem("user-token");

    if (storedToken) {
      headers = {
        Authorization: `${storedToken}`,
      };
    }

    // Create FormData object
    const requestData = new FormData();

    // If formData is an array, append each file individually with its field name
    if (Array.isArray(formData)) {
      formData.forEach((fileObj, index) => {
        const { file, fieldName } = fileObj;
        requestData.append(fieldName, file);
      });
    } else {
      // If formData is a single file, append it with its field name
      const { file, fieldName } = formData;
      requestData.append(fieldName, file);
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
