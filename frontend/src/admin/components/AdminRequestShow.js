import React, { useEffect, useState } from "react";
import {
  MyButton,
  MyLink,
  ItineraryDisplay,
  RequestContainer,
  Filter,
  ListContainer,
  QuestionModal,
  Review,
  Loading,
} from "../../elements";
import { MenuItem } from "@material-ui/core";
import { fetchRequest, fetchOptions } from "../../user/services/api";
import {
  toggleRequestFulfilled,
  fetchItineraryPackages,
  applyItineraryPackage,
  sendTextMessages,
  scrapeNames,
  scrapeSinglePage,
  deleteItinItem,
  addItinItem,
  addressCancel,
} from "../services/api-admin";
import * as moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { createUseStyles } from "react-jss";

const KEY = "AIzaSyCOyujenXkNqsCLNFS0JJS7aZ36oaeUhWs"; // Google Maps API, okay if public

const useStyles = createUseStyles({
  column: {
    width: "100%",
  },
  addBtn: {
    margin: "0px 0px 20px 0px",
  },
  timePicker: {
    width: "100%",
  },
  emptyItin: {
    fontStyle: "italic",
  },
  button: {
    marginTop: "20px",
  },
  filter: {
    marginBottom: "20px",
  },
  contactBtn: {
    marginTop: "0px",
  },
  scrapedListItem: {
    "&:hover": {
      cursor: "pointer",
      color: "turquoise",
    },
  },
  buttonDiv: {
    width: "400px",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-evenly",
    margin: "10px 0 16px 0",
  },
  venueContainer: {
    width: "100%",
    textAlign: "center",
  },
  cancelText: {
    gridColumn: "1/3",
    margin: "0 auto 0 auto",
    padding: "10px",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  },
  cancelBtn: {
    height: "40px",
  },
  modalBlurb: {
    height: "50%",
    overflow: "scroll",
  },
});

const AdminRequestShow = (props) => {
  const { userData, handleInvalidatedRequest } = props;
  const [isFetching, setIsFetching] = useState(false);
  const requestId = props.match.params.id;
  const [request, setRequest] = useState(null);
  const [itinPackages, setItinPackages] = useState(null);
  const [scrapedNames, setScrapedNames] = useState([]);
  const [modalInfo, setModalInfo] = useState(null);
  const [resTime, setResTime] = useState(null);
  const [iFrame, setIFrame] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showVenues, setShowVenues] = useState(false);
  const [singleVenue, setSingleVenue] = useState(true);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    //TODO add cleanup function?
    if (userData) {
      fetchRequest(userData, requestId).then((res) => {
        setRequest(res.request);
        setIsFetching(true);
        scrapeNames(
          userData,
          moment(res.request.start_time).format("YYYY-MM-DD")
        ).then((names) => {
          setScrapedNames(names);
          setIsFetching(false);
        });
      });
      fetchItineraryPackages(userData).then(setItinPackages);
      fetchOptions("neighborhoods", userData).then((list) => {
        list.sort((a, b) => a.name.localeCompare(b.name));
        setNeighborhoods(list);
      });
    }
  }, [userData]);

  const handleComplete = () => {
    toggleRequestFulfilled(userData, requestId, !request.fulfilled).then(
      (respJson) => {
        setRequest(respJson.request);
        handleInvalidatedRequest(respJson.request.id);
        setShowVenues(false);
      }
    );
  };

  const handleApplyPackage = (itinPackageId) => {
    applyItineraryPackage(requestId, itinPackageId, userData).then((respJson) =>
      setRequest(respJson.request)
    );
  };

  const handleMessage = () => {
    sendTextMessages(userData, requestId);
  };

  const handleRemove = (item) => {
    deleteItinItem(userData, item.id).then(() => {
      fetchRequest(userData, requestId).then((res) => {
        setRequest(res.request);
      });
    });
  };

  const openModal = () => {
    const neighborhood = modalInfo.neighborhood
      ? modalInfo.neighborhood
      : "Seattle";
    return (
      <QuestionModal
        startOpen={true}
        acceptText="Add to Itinerary"
        navigateAwayAction={() => {
          handleAddItinItem();
          setModalInfo(null);
        }}
        declineText="Back"
        closeAction={() => setModalInfo(null)}
      >
        <h2>{modalInfo.name}</h2>
        <p>
          {neighborhood + " • " + modalInfo.cuisine + " • " + modalInfo.price}
        </p>
        <p className={classes.modalBlurb}>{modalInfo.blurb}</p>
        <a href={modalInfo.make_res_link} target="_blank">
          Reservation Link
        </a>
        <div className={classes.timePicker}>
          <MuiPickersUtilsProvider
            className={classes.timePicker}
            utils={DateFnsUtils}
          >
            <KeyboardTimePicker
              disableToolbar
              variant="inline"
              minutesStep={15}
              margin="normal"
              label="Time"
              value={resTime}
              onChange={(time) => setResTime(time)}
            />
          </MuiPickersUtilsProvider>
        </div>
      </QuestionModal>
    );
  };

  const createMapUrl = (name, address) => {
    const urlEscaped = encodeURI(name + " " + address);
    const iFrameUrl = `https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${urlEscaped}`;
    setIFrame(iFrameUrl);
  };

  const handleAddItinItem = () => {
    const itinInfo = {
      ...modalInfo,
      reservation_time: resTime,
      map_iframe_url: iFrame,
    };
    addItinItem(userData, itinInfo, requestId).then((res) => {
      setRequest(res.request);
    });
  };

  const renderFilter = () => {
    return (
      <Filter
        styles={classes.filter}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setIsFetching(true);
          scrapeNames(
            userData,
            moment(request.start_time).format("YYYY-MM-DD"),
            e.target.value
          ).then((json) => {
            setIsFetching(false);
            setScrapedNames(json);
          });
        }}
      >
        <MenuItem value="All">All</MenuItem>
        {neighborhoods.map((n) => {
          return (
            <MenuItem key={n.id} value={n.name}>
              {n.name}
            </MenuItem>
          );
        })}
      </Filter>
    );
  };

  const displayPackages = () => {
    return itinPackages.map((pkg) => {
      return (
        <li key={pkg.id}>
          <MyLink destination={`/admin/itinerary_packages/${pkg.id}`}>
            {pkg.price_range.split(" ")[0]} - {pkg.neighborhood} - {pkg.title}
          </MyLink>
          <MyButton type="button" onClick={() => handleApplyPackage(pkg.id)}>
            Apply
          </MyButton>
        </li>
      );
    });
  };

  const displayScrapedVenues = () => {
    return isFetching ? (
      <Loading />
    ) : scrapedNames.length ? (
      scrapedNames
        .filter((item, i) => {
          return (
            scrapedNames.indexOf(
              scrapedNames.find((value) => value.name === item.name)
            ) === i
          );
        })
        .map((info, idx) => (
          <li
            className={classes.scrapedListItem}
            key={idx}
            onClick={() => {
              scrapeSinglePage(userData, info).then((infoJson) => {
                setModalInfo(infoJson);
                createMapUrl(infoJson.name, infoJson.address);
              });
            }}
          >
            {info.name}
          </li>
        ))
    ) : (
      <p>There are no venues available for that specification.</p>
    );
  };

  const displayVenues = () => {
    const buttonText = singleVenue ? "Packages" : "Single Venues";
    const title = !singleVenue
      ? "Packages"
      : `Venues for ${moment(request.start_time).format("MMMM Do YYYY")}`;
    return (
      <div className={classes.venueContainer}>
        <MyButton
          styles={classes.button}
          onClick={() => setSingleVenue(!singleVenue)}
        >
          {buttonText}
        </MyButton>
        <ListContainer
          title={title}
          filter={singleVenue ? renderFilter() : null}
        >
          {singleVenue ? displayScrapedVenues() : displayPackages()}
        </ListContainer>
      </div>
    );
  };

  return request ? (
    <>
      {request.cancelled &&
      request.fulfilled &&
      !request.admin_addressed_cancel ? (
        <div className={classes.cancelText}>
          <h2>Admin has addressed cancellation:</h2>
          <MyButton
            styles={classes.cancelBtn}
            onClick={() =>
              addressCancel(userData, request.id, new Date()).then((res) => {
                handleInvalidatedRequest(res.request.id);
                props.history.push({
                  pathname: "/admin",
                  state: { id: request.id },
                });
              })
            }
          >
            YES
          </MyButton>
        </div>
      ) : null}
      <div className={classes.column}>
        <RequestContainer
          className={classes.requestContainer}
          title="Request"
          request={request}
          admin={true}
        >
          {new Date(request.start_time) >= new Date() && !request.cancelled ? (
            <div className={classes.buttonDiv}>
              <MyButton type="button" onClick={handleComplete}>
                {request.fulfilled ? "Mark as incomplete" : "Mark as complete"}
              </MyButton>
              {request.fulfilled ? (
                <MyButton type="button" onClick={handleMessage}>
                  Alert (DEMO ONLY)
                </MyButton>
              ) : null}
              {!request.fulfilled && !showVenues ? (
                <MyButton
                  styles={classes.addBtn}
                  type="button"
                  onClick={() => setShowVenues(true)}
                >
                  Add to Itinerary
                </MyButton>
              ) : null}
            </div>
          ) : null}
        </RequestContainer>
        {new Date(request.start_time) < new Date() ? (
          <Review
            admin={true}
            request={request}
            userData={userData}
            handleInvalidatedRequest={handleInvalidatedRequest}
          />
        ) : null}
        {showVenues ? (
          <ItineraryDisplay
            items={request.itinerary_items}
            admin={true}
            handleRemove={handleRemove}
          >
            {!request.itinerary_items.length ? (
              <p className={classes.emptyItin}>Add some venues!</p>
            ) : null}
          </ItineraryDisplay>
        ) : null}
      </div>
      <div className={classes.column}>
        {showVenues ? (
          displayVenues()
        ) : (
          <ItineraryDisplay
            items={request.itinerary_items}
            admin={true}
            handleRemove={handleRemove}
          />
        )}
      </div>
      {modalInfo ? openModal() : null}
    </>
  ) : null;
};

export default AdminRequestShow;
