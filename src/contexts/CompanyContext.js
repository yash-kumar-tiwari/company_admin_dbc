import React, { createContext, useState, useEffect } from "react";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyIdCtx, setCompanyIdCtx] = useState(() => {
    // Check if the company ID exists in local storage
    const companyIdFromStorage = localStorage.getItem("companyId");
    return companyIdFromStorage ? companyIdFromStorage : null;
  });

  // Update local storage whenever company ID changes
  useEffect(() => {
    localStorage.setItem("companyId", companyIdCtx);
  }, [companyIdCtx]);

  return (
    <CompanyContext.Provider value={{ companyIdCtx, setCompanyIdCtx }}>
      {children}
    </CompanyContext.Provider>
  );
};
