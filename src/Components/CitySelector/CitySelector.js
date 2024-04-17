import React, { useEffect, useState } from "react";
import DropDownPickerWrapper from "../DropDownPickerWrapper/DropDownPickerWrapper";
import { fetchCities } from "../../Utils/API";

export default function CitySelector({
  country,
  onCitySelected,
  selectedCity,
}) {
  const [isLoading, updateLoading] = useState();
  const [cityList, updateCityList] = useState();

  const onChange = (value) => {
    onCitySelected?.(value.value);
  };

  const loadCities = async () => {
    if (!country) {
      return;
    }

    updateLoading(true);
    const cities = await fetchCities(country);

    updateLoading(false);
    updateCityList(cities);
  };

  useEffect(() => {
    loadCities();
  }, [country]);

  return (
    <DropDownPickerWrapper
      zIndex={99}
      searchable
      defaultValue={selectedCity}
      disabled={!country}
      placeholder={"Select City"}
      emptyLabel={!country ? "Select Country First" : "Click to load Cities"}
      options={cityList}
      loading={isLoading}
      onClickToLoad={loadCities}
      onChangeItem={onChange}
    />
  );
}
