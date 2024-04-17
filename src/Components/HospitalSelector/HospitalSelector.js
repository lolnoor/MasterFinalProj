import React, { useEffect, useState } from "react";
import { fetchHospitalList } from "../../Utils/API";
import DropDownPickerWrapper from "../DropDownPickerWrapper/DropDownPickerWrapper";

export default function HospitalSelector({
  onHospitalChange,
  selectedHospital,
}) {
  const [isLoading, updateIsLoading] = useState();
  const [hospitalList, updateHospitalList] = useState([]);

  const onChange = (value) => {
    onHospitalChange?.(value?.value);
  };

  const loadHospitals = async () => {
    updateIsLoading(true);
    const list = await fetchHospitalList();
    updateIsLoading(false);
    updateHospitalList(list);
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  return (
    <DropDownPickerWrapper
      searchable
      zIndex={110}
      defaultValue={selectedHospital}
      placeholder={"Select Hospital"}
      emptyLabel={"Click to load Hospital"}
      options={hospitalList}
      loading={isLoading}
      onClickToLoad={loadHospitals}
      onChangeItem={onChange}
    />
  );
}
