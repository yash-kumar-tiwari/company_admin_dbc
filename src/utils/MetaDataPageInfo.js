// Meta.jsx

import React from "react";
import { Helmet } from "react-helmet";

const MetaDataPageInfo = ({ title, description, keywords, favicon }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content={description || "Default page description"}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="keywords"
        content={keywords || "React, JavaScript, Web Development"}
      />
      <link
        rel="icon"
        type="image/png"
        href={favicon || "/path/to/default/favicon.png"}
      />
      {/* Add more meta tags as needed */}
    </Helmet>
  );
};

export default MetaDataPageInfo;
