import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    gridColumn: "1/3",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const LoginSignUpContainer = ({ title, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default LoginSignUpContainer;
