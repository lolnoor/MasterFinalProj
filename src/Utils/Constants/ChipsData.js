/** @format */

import {
  GENDER,
  BLOOD_GROUP,
  RHESUS_FACTOR,
  REQUEST_STATUS,
  SortBy,
  SortType,
} from "../Enums";
import * as Images from "../Images";

export const BloodGroups = [
  {
    title: BLOOD_GROUP.APlus,
  },
  {
    title: BLOOD_GROUP.AMinus,
  },
  {
    title: BLOOD_GROUP.BPlus,
  },
  {
    title: BLOOD_GROUP.ABPlus,
  },
  {
    title: BLOOD_GROUP.ABMinus,
  },
  {
    title: BLOOD_GROUP.OPlus,
  },
  {
    title: BLOOD_GROUP.OMinus,
  },
];

export const GenderData = [
  {
    title: GENDER.MALE,
    logo: Images.Gender.Male,
  },

  {
    title: GENDER.FEMALE,
    logo: Images.Gender.Female,
  },

  {
    title: GENDER.OTHER,
    logo: Images.Gender.Other,
  },
];

export const RequestTypeData = [
  {
    title: "All",
  },
  {
    title: REQUEST_STATUS.ACCEPTED,
  },
  {
    title: REQUEST_STATUS.PENDING,
  },
  {
    title: REQUEST_STATUS.COMPLETED,
  },
  {
    title: REQUEST_STATUS.CANCELLED,
  },
  {
    title: REQUEST_STATUS.EXPIRED,
  },
  {
    title: REQUEST_STATUS.REJECTED,
  },
];

export const SortTypeData = [
  { title: SortType.ASCENDING },
  { title: SortType.DESCENDING },
];

export const SortByData = [
  { title: SortBy.DONOR_NAME },
  { title: SortBy.SEND_ON },
  { title: SortBy.EXPIRE_ON },
  { title: SortBy.HOSPITAL_NAME },
];

export const SortByDonors = [
  { title: SortBy.DONOR_NAME },
  { title: SortBy.LAST_DONATION },
  { title: SortBy.BLOOD_GROUP },
];

export const BloodRequirementUrgency = [
  {
    title: "Today",
  },
  {
    title: "Tomorrow",
  },
  {
    title: "For bank",
  },
];

export const RhesusFactor = [
  {
    title: RHESUS_FACTOR.POSITIVE,
  },

  {
    title: RHESUS_FACTOR.NEGATIVE,
  },
];

export const BinaryDropDown = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];
