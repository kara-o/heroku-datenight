import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { MyLink, MyButton } from "../../elements";

const useStyles = createUseStyles({
  title: {
    textAlign: "center",
    fontSize: "64px",
  },
  container: {
    gridColumn: "1/3",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  link: {
    margin: "20px",
  },
});

const Landing = (props) => {
  const [title, setTitle] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    renderTitle();
  }, []);

  const renderTitle = () => {
    const titles = ["Welcome", "to", "DateNight."];
    let index = 0;
    const interval = setInterval(() => {
      setTitle(titles[index]);
      index += 1;
      if (index > 3) {
        clearInterval(interval);
        setShowLogin(true);
        setTitle("Welcome to DateNight.");
      }
    }, 1000);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{title}</h1>
      {showLogin ? (
        <div className={classes.options}>
          <MyButton onClick={() => props.history.push("/login")}>
            Login
          </MyButton>
          <MyLink styles={classes.link} destination="/signup">
            New user? Sign up for an account
          </MyLink>
        </div>
      ) : null}
    </div>
  );
};

export default Landing;
