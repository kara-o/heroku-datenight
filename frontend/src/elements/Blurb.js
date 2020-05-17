import React from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "10px",
    width: "100%",
  },
});

const Blurb = ({ type, name, value, onChange, placeholder }) => {
  const classes = useStyles();

  return (
    <TextField
      classes={{
        root: classes.root,
      }}
      id="outlined-multiline-flexible"
      label={placeholder}
      multiline
      rows={2}
      rowsMax={4}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
    />
  )

}

export default Blurb;


