import React, { useState, useEffect } from "react";
import {
  fetchItineraryPackage,
  createItineraryPackageItem,
  deletePkgItem,
} from "../services/api-admin";
import {
  MyButton,
  MyLink,
  SimpleCard,
  Map,
  Form,
  MyInput,
  MyPaper,
  Blurb,
} from "../../elements";
import { createUseStyles } from "react-jss";
import { useHistory } from "react-router-dom";

const useStyles = createUseStyles({
  cardsContainer: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-evenly",
  },
  column: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  italic: {
    fontStyle: "italic",
  },
  blurb: {
    width: "50%",
    resize: "none",
    margin: "10px",
  },
  buttons: {
    width: "100%",
    padding: "0 40px 0 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  link: {
    margin: "10px",
  },
  title: {
    marginBottom: "0px",
  },
});

const KEY = "AIzaSyCOyujenXkNqsCLNFS0JJS7aZ36oaeUhWs"; //public Google API key, ok if here

const ItineraryItemForm = (props) => {
  const { onSubmit } = props;
  const [duration, setDuration] = useState("");
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState("");
  const [blurb, setBlurb] = useState("");
  const [makeResLink, setMakeResLink] = useState("");
  const [iFrame, setIFrame] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const classes = useStyles();

  const handleClick = () => {
    onSubmit({
      duration,
      address,
      place,
      blurb,
      make_res_link: makeResLink,
      map_iframe_url: iFrame,
      map_url: mapUrl,
    });
    setDuration("");
    setAddress("");
    setPlace("");
    setBlurb("");
    setMakeResLink("");
    setIFrame("");
    setMapUrl("");
  };

  const handleCreateMap = () => {
    setIFrame(createMapUrl(place, address));
  };

  const createMapUrl = (place, address) => {
    const urlEscaped = encodeURI(place + " " + address);
    const iFrameUrl = `https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${urlEscaped}`;
    return iFrameUrl;
  };

  return (
    <Form>
      <MyInput
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <MyInput
        placeholder="Venue Name"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />
      <MyInput
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <MyInput
        placeholder="Make reservation link"
        value={makeResLink}
        onChange={(e) => setMakeResLink(e.target.value)}
      />
      <MyInput
        placeholder="Map URL"
        value={mapUrl}
        onChange={(e) => setMapUrl(e.target.value)}
      />
      <Blurb
        placeholder="Blurb"
        value={blurb}
        onChange={(e) => setBlurb(e.target.value)}
      />
      <div className={classes.buttons}>
        <MyButton onClick={handleCreateMap}>Generate Map</MyButton>
        {iFrame ? <Map width="75%" height="300px" url={iFrame} /> : null}
        <MyButton onClick={handleClick}>Add Item To Package</MyButton>
      </div>
    </Form>
  );
};

const AdminItineraryPackageShow = (props) => {
  const { userData } = props;
  const itinPackageId = props.match.params.id;
  const [itinPackage, setItinPackage] = useState(null);
  const [itinPackageItems, setItinPackageItems] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (userData) {
      fetchItineraryPackage(userData, itinPackageId).then((itinPackage) => {
        setItinPackage(itinPackage);
        setItinPackageItems(itinPackage.itinerary_package_items);
      });
    }
  }, [itinPackageId, userData]);

  const displayItinPackage = () => {
    if (itinPackage) {
      const i = itinPackage;
      return (
        <div>
          <p>Neighborhood: {i.neighborhood}</p>
          <p>Blurb: {i.blurb}</p>
          <p>Price Range: {i.price_range}</p>
        </div>
      );
    }
  };

  const handleItemSubmit = (formData) => {
    createItineraryPackageItem(itinPackageId, formData, userData).then(
      (pkgItem) => {
        setItinPackageItems(itinPackageItems.concat([pkgItem]));
      }
    );
  };

  const handleDelete = (id) => {
    deletePkgItem(userData, itinPackage.id, id);
    const newItinPkgItems = itinPackageItems.filter((item) => item.id !== id);
    setItinPackageItems(newItinPkgItems);
  };

  if (itinPackage === null || itinPackageItems === null) {
    return <p>Loading...</p>;
  }

  const renderPackageItems = () => {
    return itinPackageItems.map((pkgItem) => {
      return <SimpleCard pkgItem={pkgItem} handleDelete={handleDelete} />;
    });
  };

  return (
    <>
      <div className={classes.column}>
        <div className={classes.container}>
          <h1 className={classes.title}>
            Itinerary Package: {itinPackage.title}
          </h1>{" "}
          <MyLink
            styles={classes.link}
            destination={`/admin/itinerary_packages/${itinPackage.id}/edit`}
          >
            Edit
          </MyLink>
          <MyPaper>{displayItinPackage()}</MyPaper>
          <h2 className="title-fantasy-font">Package Items:</h2>
          {itinPackageItems.length ? (
            <div className={classes.cardsContainer}>{renderPackageItems()}</div>
          ) : (
            <p className={classes.italic}>No Items</p>
          )}
        </div>
      </div>
      <div className={classes.column}>
        <div className={classes.container}>
          <h2 className="title-fantasy-font">Add Items</h2>
          <ItineraryItemForm onSubmit={handleItemSubmit} />
        </div>
      </div>
    </>
  );
};

export default AdminItineraryPackageShow;
