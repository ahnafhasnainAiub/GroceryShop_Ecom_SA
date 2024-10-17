import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "My Grocery | Buy Grocery Online",
  description: "Browse and buy the latest Groceries on our online store. Find great deals on veggies, fish and meats and more. Fast shipping and secure payments.",
  keywords: "Grocery, gadgets, smartphones, laptops, online shopping, tech accessories",
};

export default Meta;
