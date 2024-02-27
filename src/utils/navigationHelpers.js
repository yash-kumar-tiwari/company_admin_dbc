// navigationUtils.js

import { toast } from "react-toastify";

let navigateFunction;

export const setNavigateFunction = (navigate) => {
  navigateFunction = navigate;
};

export const navigateToPage = (pagePath) => {
  if (navigateFunction) {
    navigateFunction(pagePath);
  } else {
    toast.error(
      "Navigate function not set. Make sure to call setNavigateFunction."
    );
    console.error(
      "Navigate function not set. Make sure to call setNavigateFunction."
    );
  }
};
