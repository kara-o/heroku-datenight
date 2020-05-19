import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    gridColumn: "1/3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

const Info = (props) => {
  const classes = useStyles();
  const { type } = props.match.params;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        {type === "about" ? "About" : "Contact Us"}
      </h1>
      {type === "about" ? (
        <div className={classes.info}>
          <p>Take the stress out of deciding where to go out.</p>
          <p>You pick the night and let us do the rest.</p>
          <p>
            Reservations will be made, all you need to do is be there and ENJOY.
          </p>
          <p></p>
          <p className="title-fantasy-font">
            Made with love for bored couples, by a bored couple :)
          </p>
        </div>
      ) : (
        <div className={classes.info}>
          <a href="mailto:datenightmain@gmail.com">datenightmain@gmail.com</a>
        </div>
      )}
    </div>
  );
};

export default Info;
