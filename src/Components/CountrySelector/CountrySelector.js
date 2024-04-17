import React, { useEffect, useState } from "react";
import { fetchCountries } from "../../Utils/API";
import DropDownPickerWrapper from "../DropDownPickerWrapper/DropDownPickerWrapper";

export default function CountrySelector({ onCountryChange, selectedCountry }) {
  const [isLoading, updateIsLoading] = useState();
  const [countryList, updateCountryList] = useState([]);

  const onChange = (value) => {
    onCountryChange?.(value?.value);
  };

  const loadCountries = async () => {
    updateIsLoading(true);
    const countries = await fetchCountries();
    updateIsLoading(false);
    updateCountryList(countries);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <DropDownPickerWrapper
      searchable
      zIndex={100}
      defaultValue={selectedCountry}
      placeholder={"Select Country"}
      emptyLabel={"Click to load Countries"}
      options={countryList}
      loading={isLoading}
      onClickToLoad={loadCountries}
      onChangeItem={onChange}
    />
  );
}
