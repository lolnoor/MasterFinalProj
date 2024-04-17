/** @format */

export const USER_TYPE = {
  ADMIN: "Admin",
  HOSPITAL: "Hospital",
  DONOR: "Donor",
};

export const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export const BLOOD_GROUP = {
  APlus: "A+",
  BPlus: "B+",
  AMinus: "A-",
  BMinus: "B-",
  ABPlus: "AB+",
  ABMinus: "AB-",
  OPlus: "O+",
  OMinus: "O-",
  A: "A",
  B: "B",
  AB: "AB",
  O: "0",
};

export const RHESUS_FACTOR = {
  POSITIVE: "+",
  NEGATIVE: "-",
};

export const FORM_TYPE = {
  TEXTINPUT: "textinput",
  DROPDOWN: "dropdown",
  DATETIME: "datetime",
  DATE: "date",
  TIME: "time",
};

export const DATABASE_NODES = {
  DONORS: "donors",
  HOSPITAL: "hospitals",
  ADMIN: "Admins",
  USERS: "users",
  DONORINFO: "donorInfo",
  HOSPITALINFO: "hospitalInfo",
  REQUEST: "request",
  HOSPITAL_NOTIFICATION: "hospital_notification",
  HOSPITAL_BROADCAST: "hospital_broadcast",
  BROADCAST_NOTIFICATION: "broadcast_notification",
  DONOR_NOTIFICATION: "donor_notification",
  COUNTRIES: "Locations/Countries",
  CITIES: "Locations/",
};

export const REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  EXPIRED: "expired",
};

export const SortType = {
  ASCENDING: "Ascending",
  DESCENDING: "Descending",
};

export const SortBy = {
  DONOR_NAME: "Donor Name",
  SEND_ON: "Send On",
  EXPIRE_ON: "Expire On",
  HOSPITAL_NAME: "Hospital Name",
  LAST_DONATION: "Last Donation",
  AGE: "Age",
  BLOOD_GROUP: "Blood Group",
};
