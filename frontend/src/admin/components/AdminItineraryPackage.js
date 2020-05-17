import React, { useState, useEffect } from "react";
import {
  MyButton,
  Errors,
  MyInput,
  Blurb,
  Filter,
  Form,
  LoadingScreen,
} from "../../elements";
import { MenuItem } from "@material-ui/core";
import {
  createItineraryPackage,
  fetchItineraryPackage,
  updateItineraryPackage,
} from "../services/api-admin";
import { fetchOptions } from "../../user/services/api";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    gridColumn: "1/3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  filter: {
    margin: "10px",
  },
});

const AdminItineraryPackage = (props) => {
  const { userData } = props;
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [neighborhoodSelection, setNeighborhoodSelection] = useState(null);
  const [priceRangeSelection, setPriceRangeSelection] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [errors, setErrors] = useState(null);
  const packageId = props.match.params.id;
  const classes = useStyles();

  useEffect(() => {
    if (userData) {
      fetchOptions("neighborhoods", userData).then((list) => {
        list.sort((a, b) => a.name.localeCompare(b.name));
        setNeighborhoods(list);
        setNeighborhoodSelection(list[0].id);
      });
      fetchOptions("price_ranges", userData).then((list) => {
        setPriceRanges(list);
        setPriceRangeSelection(list[0].id);
      });
      if (props.edit) {
        fetchItineraryPackage(userData, packageId).then((pkg) => {
          setTitle(pkg.title);
          setBlurb(pkg.blurb);
          setNeighborhoodSelection(pkg.neighborhood_id);
          setPriceRangeSelection(pkg.price_range_id);
        });
      }
    }
  }, [userData]);

  const handleSubmit = () => {
    const data = {
      title,
      blurb,
      neighborhood_id: neighborhoodSelection,
      price_range_id: priceRangeSelection,
    };

    let action = props.edit
      ? () => updateItineraryPackage(packageId, data, userData)
      : () => createItineraryPackage(data, userData);
    action().then((json) => {
      if (!json.errors) {
        props.history.push(`/admin/itinerary_packages/${json.id}`);
      } else {
        setErrors({
          errorObj: json.errors.error_obj,
          fullMessages: json.errors.full_messages,
        });
      }
    });
  };

  const renderOptions = (array, attribute) => {
    return array.map((o) => {
      return (
        <MenuItem key={o.id} value={o.id}>
          {o[`${attribute}`]}
        </MenuItem>
      );
    });
  };

  if (neighborhoodSelection === null || priceRangeSelection === null) {
    return <LoadingScreen />;
  }

  return (
    <div className={classes.container}>
      <h1 className="title-fantasy-font">Create New Itinerary Package</h1>
      <Form>
        {errors ? <Errors errors={errors} /> : null}

        <MyInput
          placeholder="Package title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Filter
          value={neighborhoodSelection}
          onChange={(e) => setNeighborhoodSelection(e.target.value)}
          styles={classes.filter}
        >
          {renderOptions(neighborhoods, "name")}
        </Filter>

        <Filter
          value={priceRangeSelection}
          onChange={(e) => setPriceRangeSelection(e.target.value)}
          styles={classes.filter}
        >
          {renderOptions(priceRanges, "max_amount")}
        </Filter>

        <Blurb
          placeholder="Write a blurb..."
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
        />

        <MyButton onClick={handleSubmit}>Submit</MyButton>
      </Form>
    </div>
  );
};

export default AdminItineraryPackage;
