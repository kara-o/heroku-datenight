import React from "react";
import { MyLink } from ".";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  navbar: {
    gridArea: "navbar",
    display: "grid",
    gridTemplateColumns:
      "[col1-start] 1fr [col1-end col2-start] 1fr [col2-end col3-start] 1fr [col3-end]",
    gridTemplateRows: "auto",
    justifyItems: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
});

const Navbar = ({ logoutUser, logoutAdmin, userData }) => {
  const classes = useStyles();

  return (
    <nav className={classes.navbar}>
      {userData && !userData.admin ? (
        <>
          <MyLink destination={`/`}>Home</MyLink>
          <MyLink destination={`/requests/new`}>Make A New Request!</MyLink>
        </>
      ) : null}
      {userData && userData.admin ? (
        <>
          <MyLink destination="/admin/">Requests</MyLink>
          <MyLink destination="/admin/itinerary_packages">Packages</MyLink>
        </>
      ) : null}
      <MyLink
        destination={userData.admin ? "/admin/login" : "/login"}
        onClick={() => {
          userData.admin ? logoutAdmin() : logoutUser();
        }}
      >
        Logout
      </MyLink>
    </nav>
  );
};

export default Navbar;
