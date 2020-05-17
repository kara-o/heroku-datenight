import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  root: {
    margin: "auto",
  },
  center: {
    gridColumn: "1/3",
  },
});

const Loading = ({ center = false }) => {
  const classes = useStyles();

  return (
    <div
      className={center ? classes.root + " " + classes.center : classes.root}
    >
      <CircularProgress />
    </div>
  );
};

export default Loading;
