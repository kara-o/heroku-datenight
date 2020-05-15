import React from "react";
import { createUseStyles } from "react-jss";

// const useStyles = createUseStyles({
//   container: {}
// });

const Errors = ({ errors }) => {
  // const classes = useStyles();
  console.log("errors: ", errors);
  const renderErrors = (errors) => {
    return errors.map((error, idx) => <li key={idx}>{error}</li>);
  };

  return <ul>{renderErrors(errors)}</ul>;
};

export default Errors;
