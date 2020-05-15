import React, { useState } from "react";
import { MyButton, QuestionModal } from ".";
import { createUseStyles } from "react-jss";
import { Card } from "@material-ui/core";

const useStyles = createUseStyles({
  container: {
    width: "200px",
    height: "200px",
    position: "relative",
    padding: "10px",
    marginBottom: "10px",
  },
  details: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
  },
});

const SimpleCard = ({ pkgItem, handleDelete }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(true);
  };

  return (
    <Card elevation={5} key={pkgItem.id} className={classes.container}>
      <div className={classes.details}>
        <p onClick={handleClick}>{pkgItem.place}</p>
        <p>{pkgItem.duration} minutes</p>
        <MyButton onClick={() => handleDelete(pkgItem.id)}>Remove</MyButton>
      </div>
      {openModal ? (
        <QuestionModal
          acceptText="Back"
          startOpen={true}
          navigateAwayAction={() => setOpenModal(false)}
        >
          <h3>{pkgItem.place}</h3>
          <p>{pkgItem.blurb}</p>
        </QuestionModal>
      ) : null}
    </Card>
  );
};

export default SimpleCard;
